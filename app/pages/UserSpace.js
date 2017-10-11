import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';

import {Link} from 'react-router-dom';

import FullPageCard from '../component/FullPageCard'

import NotificationContainer from '../containers/Notification.Container'

import {ANIMATE_CONFIG_NEXT, GLOBAL_ANIMATE_TYPE} from '../configs'

class UserSpace extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <FullPageCard cardname="个人中心">
        <div className="routes">
          <ul>
            <li>
              <Link to="/myspace/collections">
                <h4>我的句集</h4>
                <p>查看所有的句集</p>
              </Link>
            </li>
            <li>
              <Link to="/myspace/profiles">
                <h4>账号设置</h4>
                <p>修改邮箱，修改密码</p>
              </Link>
            </li>
            <li>
              <Link to="/managements/sources">
                <h4>来源管理</h4>
                <p>管理添加获取句子的URL</p>
              </Link>
            </li>
            <li>
              <Link to="/managements/patterns">
                <h4>模式管理</h4>
                <p>根据自己喜好选择来源形成模式</p>
              </Link>
            </li>
            <li>
              <Link to="/managements/sources">
                <h4>离线同步</h4>
                <p>管理添加获取句子的URL</p>
              </Link>
            </li>
            <li>
              <Link to="/managements/patterns">
                <h4>缓存清理</h4>
                <p>根据自己喜好选择来源形成模式</p>
              </Link>
            </li>
          </ul>
        </div>
      </FullPageCard>
    );
  }
}

export default UserSpace;
