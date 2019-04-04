// @flow
import React from 'react';
import DataVis from './DataVis';
import { DataProvider} from './DataContext';

type State = {
  dataUrl: string,
  configUrl: string
};

export default
class App extends React.Component<State, {}>  {

  state = {
    dataUrl: 'https://zbeegqlserver.herokuapp.com/data/commutes.csv',
    configUrl: 'https://zbeegqlserver.herokuapp.com/data/kepler.commutes.config.json',
    onDataUrlChanged: ::this.onDataUrlUpdated
  }

  onDataUrlUpdated(url: String) {
    this.setState({
      dataUrl: url
    });
  }

  render() {
    return (<DataProvider value={this.state}>
              <DataVis dataUrl={this.state.dataUrl}
                       configUrl={this.state.configUrl} />
            </DataProvider>)
  }
}
