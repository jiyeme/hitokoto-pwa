import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import FullPage from '../component/FullPage';

import {settingWrapper, left, right} from './Setting.css'

export default class Setting extends Component {

  render() {
    let {font, fontWeight, layoutHorizon, backgroundColor} = this.props.layout;

    let changeLayout = this.props.changeLayout;

    return (
      <FullPage
        style={{
        backgroundColor: "rgba(255,255,255,.01)"
      }}
        onClick={e => {
        console.log('bg click');
        this
          .props
          .history
          .replace('/');
      }}>
        <div
          className={settingWrapper}
          onClick={e => {
          console.log('wrapper click');
          e.stopPropagation();
          e.cacleBubble = true;
          return false;
        }}>
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
                <option value="fongsong">仿宋</option>
                <option value="kai">楷体</option>
              </select>
            </dd>
            <dt>字重</dt>
            <dd>
              <select
                value={fontWeight}
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
            <dt>文字方向</dt>
            <dd>
              <select
                value={layoutHorizon}
                onChange={event => {
                changeLayout('layoutHorizon', event.target.value == 'true')
              }}>
                <option value="true">横向</option>
                <option value="false">竖向</option>
              </select>
            </dd>
            <dt>页面背景颜色</dt>
            <dd>
              <input
                type="color"
                onChange={(event) => {
                changeLayout('backgroundColor', event.target.value)
              }}
                value={backgroundColor}/>
            </dd>
          </dl>
        </div>
      </FullPage>
    );
  }
}