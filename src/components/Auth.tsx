import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { State } from 'src/interfaces'

interface Props {}

const Auth = ({  }: Props): JSX.Element => {
  return <div>Hello Auth</div>
}

const mapStateToProps = ({  }: State): Props => ({})

export default withRouter(connect(mapStateToProps)(Auth))
