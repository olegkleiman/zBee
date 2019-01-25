// @flow
import React from 'react';
import { fetchQuery, graphql } from 'react-relay';
import environment from './Environment';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

type State = {
  dropdownOpen: boolean,
  origins: [String],
  selectedOrigin: String
}

type Props = {
}

type Origin = {
    id: String,
    originId: number,
    name: String
}

const originsQuery = graphql`
  query OriginFilter_Query {
      origins {
        originId
        name
      }
  }
`;

class OriginFilter extends React.Component<Props, State> {

  state = {
    dropdownOpen: false,
    origins: [],
    selectedOrigin: 'Select Origin'
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  originSelected(e) {
    this.setState({
      selectedOrigin: e.currentTarget.textContent
    })
  }

  async componentDidMount() {
    try {
      const gqlData = await fetchQuery(environment, originsQuery, {});
      this.setState({origins:gqlData.origins})
    } catch(err) {
      console.error(err);
    }
  }

  render() {
    return (
      <Dropdown isOpen={this.state.dropdownOpen} size="sm" toggle={::this.toggle}>
        <DropdownToggle caret>
          {this.state.selectedOrigin}
        </DropdownToggle>
        <DropdownMenu right>
          {
            this.state.origins.map(origin => {
              return (<DropdownItem onClick={::this.originSelected}>{origin.name}</DropdownItem>)
            })
          }
        </DropdownMenu>
      </Dropdown>
    )
  }

}

export default OriginFilter;
