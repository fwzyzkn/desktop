import * as React from 'react'

import {default as Repo} from '../models/repository'
import Toolbar from './toolbar'
import {Changes} from './changes'
import History from './history'
import ComparisonGraph from './comparison-graph'
import {TabBarTab} from './toolbar/tab-bar'
import { IHistoryState } from '../lib/app-state'
import { Dispatcher } from '../lib/dispatcher'

interface RepositoryProps {
  repo: Repo
  history: IHistoryState
  dispatcher: Dispatcher
}

interface RepositoryState {
  selectedTab: TabBarTab
}

export default class Repository extends React.Component<RepositoryProps, RepositoryState> {
  public constructor(props: RepositoryProps) {
    super(props)

    this.state = {selectedTab: TabBarTab.Changes}
  }

  public componentDidMount() {
    this.repositoryChanged()
  }

  public componentDidUpdate(prevProps: RepositoryProps, prevState: RepositoryState) {
    const changed = prevProps.repo.id !== this.props.repo.id
    if (changed) {
      this.repositoryChanged()
    }
  }

  private renderNoSelection() {
    return (
      <div>
        <div>No repo selected!</div>
      </div>
    )
  }

  private renderContent() {
    if (this.state.selectedTab === TabBarTab.Changes) {
      return <Changes selectedRepo={this.props.repo}/>
    } else if (this.state.selectedTab === TabBarTab.History) {
      return <History repository={this.props.repo}
                      selection={this.props.history.selection}
                      dispatcher={this.props.dispatcher}
                      files={this.props.history.changedFiles}/>
    } else {
      return null
    }
  }

  public render() {
    const repo = this.props.repo
    if (!repo) {
      return this.renderNoSelection()
    }

    return (
      <div id='repository'>
        <Toolbar selectedTab={this.state.selectedTab} onTabClicked={tab => this.onTabClicked(tab)}/>
        <ComparisonGraph/>
        {this.renderContent()}
      </div>
    )
  }

  private onTabClicked(tab: TabBarTab) {
    this.setState(Object.assign({}, this.state, {selectedTab: tab}))
  }

  private repositoryChanged() {
    this.setState(Object.assign({}, this.state, {selectedTab: TabBarTab.Changes}))
  }
}
