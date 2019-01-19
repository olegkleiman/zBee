// flow
import React from 'react';
import { connect } from 'react-redux';
import { fetchQuery, graphql } from 'react-relay';
import environment from './Environment';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import KeplerGl from 'kepler.gl';
import { addDataToMap, forwardTo } from 'kepler.gl/actions';
import Processors from 'kepler.gl/processors';

const MAPBOX_TOKEN = process.env.MapboxAccessToken;

type State = {
}

type Props = {
  app: {
    fromDate: Date,
    tillDate: Date
  }
}

const keplerQuery = graphql`
  query App_Query($from: Date!,
                      $till: Date!) {
      keplerDataUrl(from: $from, till: $till)
  }
`;

import zBeeConfig from '../data/zbee-config.json';

class App extends React.Component<Props, State> {

  async componentDidMount() {

      const queryVariables = {
        from: '14/01/2019', //this.props.app.fromDate,
        till: '22/01/2019' //this.props.app.tillDate
      };

      try {

        const gqlData = await fetchQuery(environment, keplerQuery, queryVariables);

        const resp = await fetch(gqlData.keplerDataUrl);
        const zBeeTrips = await resp.text();

        const data = Processors.processCsvData(zBeeTrips);

        // Create dataset structure
        const dataset = {
          data,

          info: {
            // `info` property are optional, adding an `id` associate with this dataset makes it easier
            // to replace it later
            id: 'my_data'
          }
        };

        this.props.keplerGlDispatch(addDataToMap({
                                          datasets: dataset,
                                          options: {
                                            centerMap: true,
                                            readOnly: false
                                          },
                                          config: zBeeConfig
                                        })
                          );
    } catch(err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%', minHeight: '70vh'}}>

      </div>
    )
  }
}

const mapStateToProps = state => state;
const dispatchToProps = (dispatch, props) => ({
  dispatch,
  keplerGlDispatch: forwardTo('map', dispatch)
});

export default connect(mapStateToProps, dispatchToProps)(App);
