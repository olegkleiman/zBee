// @flow
import React from 'react';
import { connect } from 'react-redux';
import { fetchQuery, graphql } from 'react-relay';
import environment from './Environment';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import KeplerGl from 'kepler.gl';
import { addDataToMap, forwardTo } from 'kepler.gl/actions';
import Processors from 'kepler.gl/processors';

import zBeeConfig from '../data/zbee-config.json';

const MAPBOX_TOKEN = process.env.MapboxAccessToken;

const keplerQuery = graphql`
  query DataVis_Query($from: Date!,
                      $till: Date!) {
      keplerDataUrl(from: $from, till: $till)
  }
`;

type State = {
}

type Props = {
  app: {
    fromDate: Date,
    tillDate: Date
  }
}


class DataVis extends React.Component {

  async componentDidMount() {

      const queryVariables = {
        from: '09/24/2018', //this.props.app.fromDate,
        till: '09/25/2018' //this.props.app.tillDate
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
              <AutoSizer>
                {({height, width}) => (
                  <KeplerGl
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                    id="map"
                    width={width}
                    height={height}
                    placeholder={'ddd'}
                  />
                )}
              </AutoSizer>
            </div>
      )
  }
};

const mapStateToProps = state => state;
const dispatchToProps = (dispatch, props) => ({
  dispatch,
  keplerGlDispatch: forwardTo('map', dispatch)
});

export default connect(mapStateToProps, dispatchToProps)(DataVis);
