import React from 'react';
import { IndexRoute, Route } from 'react-router';
import isomFetch from 'isom-fetch';
import {
  App,
  Audit,
  Home,
  // Demo,
  Log,
  NoMatch,
  ProjectLog,
  Repository,
  Replacement,
  ReplWorkbench,
  Transition,
  Search,
  Notification,
  Upload,
  Workbench,
  Uploaded,
  VersionComparison,
  Authority,
  History,
  PublicProject,
  Help,
  LdapAuth,
  Statistic,
  DisabledCode,
  ProjectList,
  ProjectNull,
  ReviewProject,
  ReviewProjectAdmin,
} from './containers';

const fetch = isomFetch.create({ baseURL: '/api' });

const validate = (type, transition) => (nextState, replace, next) => {
  fetch
    .post(`/validate/${type}`)
    .then(data => {
      if (!data.res) replace(`/transition/${transition}`);
      next();
    })
    .catch(() => {
      next();
    });
};

export default store => {
  // 处理权限校验
  const requireLogin = validate('login', 'no-login', store);
  const requireOwner = validate('owner', 'no-auth', store);
  const requireAdmin = validate('admin', 'no-auth', store);

  return (
    <Route path="/" component={App}>
      {/* 首页路由 */}
      <IndexRoute component={Home} />

      {/* 无认证，可访问 */}
      <Route path="repositories/:id" component={Repository} />
      <Route path="projects/:id" component={PublicProject} />
      <Route path="transition/:type" component={Transition} /> {/* 跳转页面 */}
      <Route path="search" component={Search} /> {/* 搜索结果 */}
      <Route path="help" component={Help} /> {/* 帮助中心 */}
      <Route path="ldapauth" component={LdapAuth} /> {/* LDAP登录 */}
      <Route path="statistic" component={Statistic} /> {/* 图标统计 */}

      {/* 认证后，可访问 */}
      <Route onEnter={requireLogin}>
        <Route path="upload(/repository/:repoId)" component={Upload} /> {/* 上传图标 */}
        <Route path="workbench(/repository/:repoId)" component={Workbench} /> {/* 工作台 */}
        <Route path="projects" component={PublicProject} />
        <Route path="projects/:id/logs" component={ProjectLog} />
        <Route path="projects/:id/comparison" component={VersionComparison} />
        <Route path="projects/:id/history" component={History} />
        <Route path="projectlist/:id" component={ProjectList} /> {/* 公开项目列表 */}
        <Route path="projectlist" component={ProjectNull} /> {/* 公开项目为空页面 */}
        <Route path="replacement" component={Replacement} /> {/* 替换页面 */}
        <Route path="replacement/icon/:fromId...:toId" component={ReplWorkbench} /> {/* 替换页面 */}

        <Route path="user">
          <Route path="notifications" component={Notification} /> {/* 通知页面 */}
          <Route path="icons" component={Uploaded} />
        </Route>

        {/* 库管用户 */}
        <Route onEnter={requireOwner}>
          {/* <Route path="replacement" component={Replacement} /> */} {/* 替换页面 */}
          {/* <Route path="replacement/icon/:fromId...:toId" component={ReplWorkbench} /> */}
          {/* 替换页面 */}
          <Route path="auditing" component={Audit} /> {/* 审核页面 */}
          <Route path="repositories/:id/logs" component={Log} /> {/* 大库日志 */}
        </Route>

        {/* 超管用户 */}
        <Route path="admin" onEnter={requireAdmin}>
          <Route path="authority/:type" component={Authority} /> {/* 权限设置 */}
          <Route path="code" component={DisabledCode} /> {/* 系统占用编码管理 */}
          <Route path="reviewproject" component={ReviewProject} /> {/* 后台审核公开项目列表 */}
          <Route path="reviewprojectadmin" component={ReviewProjectAdmin} /> {/* 后台审核申请项目管理员列表 */}
        </Route>
      </Route>

      <Route path="*" component={NoMatch} />
    </Route>
  );
};
