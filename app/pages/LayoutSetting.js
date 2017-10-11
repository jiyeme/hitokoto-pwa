import React, {Component} from 'react';
import PropTypes from 'prop-types'

import {Link, withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import FullPage from '../component/FullPage';
import hitokotoDriver from '../API/hitokotoDriver'

import {settingWrapper, left, right} from './LayoutSetting.css'
import {PANEL_OPEN} from '../actions'
import {GLOBAL_ANIMATE_TYPE} from '../configs'

class LayoutSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPatternID: hitokotoDriver.pattern.id
    }
  }
  handlePatternChange(id) {
    if (id !== hitokotoDriver.pattern.id) {
      let pattern = hitokotoDriver.patterManager.getPatternById(id);
      hitokotoDriver.drive(pattern).start();
      this.setState({currentPatternID: id})
    }
  }
  render() {
    let {
      changeLayout,
      layout: {
        font,
        fontWeight,
        layoutHorizon,
        backgroundColor,
        revert2white,
        showCover
      },
      hide,
      patternChange,
      panel
    } = this.props;

    let patterns = hitokotoDriver.patterManager.patterns,
      currentPatternID = this.state.currentPatternID;
    let patternOptions;
    if (patterns) {
      patternOptions = patterns.map((pattern) => (
        <option key={pattern.id} value={pattern.id}>{pattern.name}</option>
      ))
      patternOptions = (
        <dl key="s-pattern">
          <dt>模式</dt>
          <dd>
            <select
              name="mode"
              onChange={event => {
              this.handlePatternChange(Number(event.target.value));
            }}
              defaultValue={currentPatternID}>{patternOptions}</select>
          </dd>
        </dl>
      )
    }
    let Child;
    if (panel === PANEL_OPEN + 'layoutSetting') {
      Child = (
        <FullPage
          style={{
          backgroundColor: "rgba(255,255,255,.01)"
        }}
          key='layoutsetting'
          onClick={hide}>
          <div
            className={settingWrapper}
            onClick={e => {
            e.stopPropagation();
            return false;
          }}>
            <div className="clearfix">
              <dl>
                <dt>字体</dt>
                <dd>
                  <select
                    value={font}
                    onChange={(event) => {
                    changeLayout('font', event.target.value)
                  }}>
                    <option value="default">默认</option>
                    <option value="simsun">宋体</option>
                    <option value="fangsong">仿宋</option>
                    <option value="kai">楷体</option>
                  </select>
                </dd>
              </dl>
              <dl key="s-frontw">
                <dt>字重</dt>
                <dd>
                  <select
                    defaultValue={fontWeight}
                    onChange={(event) => {
                    changeLayout('fontWeight', event.target.value)
                  }}>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                    <option value="500">500</option>
                    <option value="600">600</option>
                    <option value="700">700</option>
                    <option value="800">800</option>
                    <option value="900">900</option>

                  </select>
                </dd>
              </dl>
              <dl key="s-frontd">
                <dt>文字方向</dt>
                <dd>
                  <select
                    defaultValue={layoutHorizon}
                    onChange={event => {
                    changeLayout('layoutHorizon', event.target.value == 'true')
                  }}>
                    <option value="true">横向</option>
                    <option value="false">竖向</option>
                  </select>
                </dd>
              </dl>
              <dl key="s-bgc">
                <dt>页面背景颜色</dt>
                <dd>
                  <input
                    type="color"
                    onChange={(event) => {
                    changeLayout('backgroundColor', event.target.value)
                  }}
                    defaultValue={backgroundColor}/>
                </dd>
              </dl>
              <dl key="s-r2w">
                <dt>使用白色UI</dt>
                <dd className="form">
                  <input
                    type="checkbox"
                    hidden
                    onChange={(event) => {
                    changeLayout('revert2white', event.target.checked)
                  }}
                    id="id-r2w"
                    defaultChecked={revert2white}/>
                  <label htmlFor="id-r2w"></label>
                </dd>
              </dl>
              <dl key="s-cover">
                <dt>隐藏PC导航</dt>
                <dd className="form">
                  <input
                    type="checkbox"
                    hidden
                    onChange={(event) => {
                    changeLayout('showCover', event.target.checked)
                  }}
                    id="id-cover"
                    defaultChecked={showCover}/>
                  <label htmlFor="id-cover"></label>
                </dd>
              </dl>
              <dl key="s-sh">
                <dt>加载思源宋体</dt>
                <dd className="form">
                  <input
                    type="checkbox"
                    hidden
                    onChangesss={(event) => {
                    changeLayout('sourcehan', event.target.checked)
                  }}
                    id="id-sourcehan"
                    defaultChecked={false}/>
                  <label htmlFor="id-sourcehan"></label>
                </dd>
              </dl>
              {patternOptions}
            </div>
          </div>
        </FullPage>
      )
    } else {
      Child = <div key='none'></div>
    }
    return (
      <QueueAnim type={GLOBAL_ANIMATE_TYPE} ease={['easeOutQuart', 'easeInOutQuart']}>
        {Child}
      </QueueAnim>
    );
  }
}
LayoutSetting.propTypes = {
  changeLayout: PropTypes.func.isRequired,
  layout: PropTypes.shape({font: PropTypes.string.isRequired, fontWeight: PropTypes.string.isRequired, layoutHorizon: PropTypes.bool.isRequired, backgroundColor: PropTypes.string.isRequired}),
  hide: PropTypes.func.isRequired,
  panel: PropTypes.string.isRequired
}

export default withRouter(LayoutSetting)