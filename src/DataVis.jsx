// @flow
import React from 'react';
import { connect } from 'react-redux';
import { fetchQuery, graphql } from 'react-relay';
import environment from './Environment';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
// import KeplerGl from 'kepler.gl';
import { toggleFullScreen, addDataToMap, forwardTo } from 'kepler.gl/actions';
import Processors from 'kepler.gl/processors';
import {withState, injectComponents, PanelHeaderFactory} from 'kepler.gl/components';
import OriginFilter from './OriginFilter';

// define custom header
const myCustomHeaderFactory = () => OriginFilter;

// Inject custom header into Kepler.gl, replacing default
const KeplerGl = injectComponents([
  [PanelHeaderFactory, myCustomHeaderFactory],
  // [SidePanelFactory, nullComponentFactory]
]);

const MAPBOX_TOKEN = process.env.MapboxAccessToken;

const keplerQuery = graphql`
  query DataVis_Query($from: Date!,
                      $till: Date!) {
      keplerDataUrl(from: $from, till: $till)
      keplerConfigUrl
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

        let resp = await fetch(gqlData.keplerDataUrl);
        const zBeeTrips = await resp.text();

        resp = await fetch(gqlData.keplerConfigUrl);
        const zBeeConfig = await resp.json();

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
                  <div>
                    <button onClick={() => props.keplerGlDispatch(toggleFullScreen())}/>
                    <KeplerGl
                      mapboxApiAccessToken={MAPBOX_TOKEN}
                      id="map"
                      version='0.2.1-beta'
                      width={width}
                      height={height}
                    />
                  </div>
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
