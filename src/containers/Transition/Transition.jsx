import React, { Component, PropTypes } from 'react';
import { replace } from 'react-router-redux';
import { connect } from 'react-redux';
import './Transition.scss';
import redirectToLogin from '../../helpers/login';

@connect()
export default class Transition extends Component {
  static propTypes = {
    params: PropTypes.object,
    location: PropTypes.object,
    type: PropTypes.string,
    dispatch: PropTypes.func,
  }

  state = {
    second: 2,
  }

  componentDidMount() {
    const { type } = this.props.params;
    switch (type) {
      case 'no-auth': {
        this.backToPage('/');
        break;
      }
      case 'no-login': {
        this.goToLoginPage();
        break;
      }
      case 'repl-icon': {
        const { repoId } = this.props.location.query;
        this.backToPage(`/repositories/${repoId}`);
        break;
      }
      case 'audit-icon': {
        this.backToPage('/');
        break;
      }
      case 'upload-icon': {
        this.backToPage('/auditing');
        break;
      }
      case 'ldapauth-failed': {
        this.backToPage('/ldapauth');
        break;
      }
      case 'replUpload-success': {
        const { repoId } = this.props.location.query;
        this.backToPage(`/repositories/${repoId}`);
        break;
      }
      default: {
        break;
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  goToLoginPage() {
    this.intervalId = setInterval(() => {
      this.setState({
        second: this.state.second - 1,
      }, () => {
        if (this.state.second <= 0) {
          clearInterval(this.intervalId);
          redirectToLogin();
        }
      });
    }, 1000);
  }

  backToPage(url) {
    this.intervalId = setInterval(() => {
      this.setState({
        second: this.state.second - 1,
      }, () => {
        if (this.state.second <= 0) {
          clearInterval(this.intervalId);
          this.props.dispatch(replace(url));
        }
      });
    }, 1000);
  }

  immedBackToPage(url) {
    clearInterval(this.intervalId);
    this.props.dispatch(replace(url));
  }

  render() {
    const { type } = this.props.params;
    const { repoId } = this.props.location.query;
    const noLoginHTML = (
      <div>
        <div className="no-auth-logo"></div>
        <p className="no-auth-tips">
          该页面需要登录
        </p>
        <p className="no-auth-tips">{this.state.second} 秒之后跳转至登录页</p>
      </div>
    );

    const transHTML = (
      <div>
        <div className="no-auth-logo"></div>
        <p className="no-auth-tips">你没有权限访问这个页面</p>
        <p className="no-auth-tips">{this.state.second} 秒之后跳转至首页</p>
      </div>
    );

    const replIconHTML = (
      <div>
        <div className="no-auth-nores"></div>
        <div className="no-auth-tips">
          <p>替换成功</p>
          <p>{this.state.second} 秒之后跳转至图标库页</p>
          <p>替换图标位于库的最后</p>
        </div>
        <p>
          <button
            className="no-auth-login"
            onClick={() => this.immedBackToPage(`/repositories/${repoId}`)}
          >
            点击跳转
          </button>
        </p>
      </div>
    );

    const auditIconHTML = (
      <div>
        <div className="no-auth-nores"></div>
        <div className="no-auth-tips">
          <p>没有待审核图标</p>
          <p>{this.state.second} 秒之后跳转至首页</p>
        </div>
        <p>
          <button
            className="no-auth-login"
            onClick={() => this.immedBackToPage('/')}
          >
            点击跳转
          </button>
        </p>
      </div>
    );

    const uploadIconHTML = (
      <div>
        <div className="no-auth-nores"></div>
        <div className="no-auth-tips">
          <p>没有待上传的图标</p>
          <p>{this.state.second} 秒之后跳转至图标审核页</p>
        </div>
        <p>
          <button
            className="no-auth-login"
            onClick={() => this.immedBackToPage('/audit')}
          >
            点击跳转
          </button>
        </p>
      </div>
    );

    const ldapAuthFailedHTML = (
      <div>
        <div className="no-auth-logo"></div>
        <div className="no-auth-tips">
          <p>登录认证失败</p>
          <p>{this.state.second} 秒之后跳转至登录页</p>
        </div>
      </div>
    );

    const replUploadHTML = (
      <div>
        <div className="no-auth-nores"></div>
        <div className="no-auth-tips">
          <p>替换的图标上传成功，请等待库管审核通过</p>
          <p>{this.state.second} 秒之后跳转至图标库页</p>
        </div>
        <p>
          <button
            className="no-auth-login"
            onClick={() => this.immedBackToPage(`/repositories/${repoId}`)}
          >
            点击跳转
          </button>
        </p>
      </div>
    );

    return (
      <div>
        <div className="no-auth">
          {type === 'no-auth' && transHTML}
          {type === 'no-login' && noLoginHTML}
          {type === 'repl-icon' && replIconHTML}
          {type === 'audit-icon' && auditIconHTML}
          {type === 'upload-icon' && uploadIconHTML}
          {type === 'ldapauth-failed' && ldapAuthFailedHTML}
          {type === 'replUpload-success' && replUploadHTML}
        </div>
      </div>
    );
  }
}
