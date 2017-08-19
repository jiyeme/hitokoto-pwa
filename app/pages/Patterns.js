import React, {Component} from 'react';
import FullPageCard from '../component/FullPageCard'
import PatternDisplay from '../component/PatternDisplay'
import QueueAnim from 'rc-queue-anim';

import hitokotoDriver from '../API/hitokotoDriver'

import style from './UI.css';
import {Link} from 'react-router-dom';

let {
  manageBox,
  clearfix,
  'close-button': closeButton,
  icon,
  close,
  sourcesList,
  back,
  backButton,
  ellipsis
} = style;
class Patterns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patterns: hitokotoDriver.patterManager.patterns,
      update: undefined,
      newPattern: undefined
    }
  }
  showUpdate(id) {
    this.setState({update: id});
  }
  handleUpdate(id, pattern) {
    hitokotoDriver.updatePattern(id, pattern);
    this.hideUpdate();
    this.setState({pattern: this.state.patterns})
  }
  hideUpdate() {
    this.setState({update: undefined})
  }
  handleDelete(id) {
    if (confirm('你确认要删除该模式？')) {
      hitokotoDriver
        .patterManager
        .deletePattern(id);
      this.hideUpdate()
    }
  }
  showNewPattern() {
    this.setState({
      newPattern: Date.now()
    });
  }
  hideNewPattern() {
    this.setState({newPattern: undefined});
  }
  handleNewPattern(pattern) {
    hitokotoDriver
      .patterManager
      .newPattern(pattern);
    this.hideNewPattern();
    this.setState({pattern: hitokotoDriver.patterManager.patterns})
  }
  render() {

    let lists = this
      .state
      .patterns
      .map((pattern) => {
        return (
          <li key={pattern.id}>
            <p className={ellipsis}>
              <button
                onClick={this
                .showUpdate
                .bind(this, pattern.id)}>修改</button>&nbsp; {pattern.name}{pattern.default
                ? '（当前默认模式）'
                : ''}
            </p>
          </li>
        )
      })

    let patternDisplay;
    if (this.state.update) {
      let patternToUpdate = this
        .state
        .patterns
        .find((p) => {
          if (p.id == this.state.update) {
            return true;
          } else {
            return false;
          }
        })

      patternDisplay = (<PatternDisplay
        pattern={patternToUpdate}
        title="修改"
        sources={hitokotoDriver.patterManager.sources}
        hook={{
        hide: this
          .hideUpdate
          .bind(this),
        update: this
          .handleUpdate
          .bind(this),
        delete: this
          .handleDelete
          .bind(this)
      }}/>)
    } else if (this.state.newPattern) {
      patternDisplay = (<PatternDisplay
        title="新增"
        sources={hitokotoDriver.patterManager.sources}
        hook={{
        hide: this
          .hideNewPattern
          .bind(this),
        newPattern: this
          .handleNewPattern
          .bind(this)
      }}/>)
    }
    return (

      <FullPageCard>
        <div className={manageBox}>
          <input type="radio" name="pattern-tab" value="pattern" hidden/>
          <input type="radio" name="pattern-tab" value="api" hidden/>
          <h1>模式管理
            <Link to='/' className={closeButton}>
              <i className={icon + ' ' + close}></i>
            </Link>
            <Link to='/' className={backButton}>
              <i className={icon + ' ' + back}></i>
            </Link>
          </h1>
          <hr/>
          <div>
            <QueueAnim component="ul" className={sourcesList}>
              {lists}
              <li key="new">
                <button
                  onClick={this
                  .showNewPattern
                  .bind(this)}
                  style={{
                  float: 'right'
                }}>添加</button>
              </li>
            </QueueAnim>
          </div>
        </div>
        {patternDisplay}
      </FullPageCard>
    );
  }
}

export default Patterns;