import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { State } from 'src/redux/state'

interface RouteParams {
  qnum: string
}

interface StateProps {}

type Props = RouteComponentProps<RouteParams> & StateProps

const All = (props: Props): JSX.Element => {
  return <div>All, qnum={props.match.params.qnum}</div>
}

const mapStateToProps = ({  }: State): StateProps => ({})

export default withRouter(connect(mapStateToProps)(All))