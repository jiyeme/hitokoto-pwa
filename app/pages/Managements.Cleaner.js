import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import Task from '../API/Task';
import showNotification from '../API/showNotification';
import timeTransform from '../API/social-time-transform';
import httpManager from '../API/httpManager';
import indexedDBManager from '../API/IndexedDBManager'
import offlineWatcher from '../API/Offline'
import hitokotoDriver from '../API/hitokotoDriver'
const patterManager = hitokotoDriver.patterManager;

import FullPageCard from '../component/FullPageCard'
import Modal from '../component/Modal'

class Cleaner extends Component {
  constructor(props) {
    super(props);

    let inPatterns = new Map();
    patterManager.patterns.forEach(function (pattern) {
      pattern.sources.forEach(source => {
        inPatterns.set(source.url, source.name);
      })
    });

    let inSources = new Map();
    patterManager.sources.forEach(source => {
      inSources.set(source.url, source.name);
    })

    this.state = {
      states: null,
      inPatterns,
      inSources,
      chooseModal: false
    }
  }
  componentWillMount() {
    indexedDBManager.getStates().then(stateList => {
      this.setState({states: stateList});
    })
  }
  clearCache(url) {
    indexedDBManager.clearOneSource(url).then(count => {
      return indexedDBManager.removeSyncRecord(url).then(removed => {

        showNotification('共删除' + count + '条！', 'success');
        this.setState(state => {
          let index = state.states.findIndex(a => a[0] == url);
          state.states.splice(index, 1);
          state.inSources.delete(url);
          state.inPatterns.delete(url);

          return state
        })
      });
    });
  }
  showChooseModal(url) {
    this.setState({chooseModal: url});
  }
  export(type) {
    let task = new Task();
    task.update('准备数据中...');
    indexedDBManager.exportHitokotos(this.state.chooseModal).then(hitokotos => {
      task.update('数据准备完成，格式转换中...');
      if (type == 'txt') {
        //
        return new Blob(hitokotos.map(h => {
          return `\n${h.id}
${h.hitokoto}
${h.author} - ${h.source}
由 ${h.creator} 创建于
${h.created_at}\n\n`
        }), {type: 'text/plain'})
      } else if (type == 'json') {
        //
        return new Blob([JSON.stringify(hitokotos, null, 2)], {type: 'application/json'});
      }
    }).then(file => {
      let a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download = new Date().toLocaleString() + '.' + type;

      a.onclick = () => {
        URL.revokeObjectURL(file)
      };

      a = document.body.appendChild(a);
      a.click();

      task.success('格式转换完成，尝试下载');
    }).catch(e => {
      task.failed('执行失败：' + e.message || e)
    });
    this.hideChooseModal()
  }
  hideChooseModal() {
    this.setState({chooseModal: false})
  }
  render() {
    let list, {states, inPatterns, inSources} = this.state;
    if (states) {

      states = states.slice().sort((a, b) => {
        return (inPatterns.has(a[0]) + inSources.has(a[0])) - (inPatterns.has(b[0]) + inSources.has(b[0]))
      })

      list = states.map(arr => {
        let url = arr[0],
          count = arr[1],
          _p = inPatterns.has(url),
          _s = inSources.has(url),
          name;

        if (_p) {
          name = inPatterns.get(url);
        } else if (_s) {
          name = inSources.get(url);
        } else {
          name = '已删除的来源'
        }

        return (
          <li key={url}>
            <div>
              <h4
                className={(_p | _s)
                ? "ellipsis"
                : 'color-red ellipsis'}>{name}</h4>
              <p className="txt-sm">
                已缓存{count}
              </p>
              <p className="acts">
                <button onClick={() => this.showChooseModal(url)}>导出</button>
                <button className="color-red" onClick={this.clearCache.bind(this, url)}>全部清除</button>
              </p>
            </div>
          </li>
        )

      })
    } else {
      list = (
        <li key="loading">
          <div>
            <h1>
              <i className="iconfont icon-loading-anim"></i>载入中</h1>
          </div>
        </li>
      )
    }

    if (states && states.length == 0) {
      list = (
        <li key="zero">
          <div>
            <h1 className="color-red">
              <i className="iconfont icon-tishi"></i>非常干净！</h1>
            <p>当前没有使用IndexedDB缓存数据</p>
          </div>
        </li>
      )
    }
    return (
      <FullPageCard cardname="缓存清理">
        <div className="lum-list ">
          <ul>
            {list}
          </ul>
        </div>
        {this.state.chooseModal
          ? (
            <Modal exit={() => this.hideChooseModal()}>
              <h1>请选择导出的类型：</h1>
              <p>
                <button onClick={() => this.export('txt')}>纯文本</button>
                <button onClick={() => this.export('json')}>JSON</button>
              </p>
            </Modal>
          )
          : null}
      </FullPageCard>
    )
  }
}
export default Cleaner
