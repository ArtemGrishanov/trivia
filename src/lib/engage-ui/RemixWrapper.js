import sizeMe from 'react-sizeme'
import PropsNormalizer from './PropsNormalizer'
import { getPropertiesBySelector } from '../object-path'
import { connect } from 'react-redux'

export default (Component, Schema, displayName, statePath) => {
    return compose(
        sizeMe({monitorHeight: true, noPlaceholder: true}),
        PropsNormalizer(Schema),
        connect(
            (state, ownProps) => {
                if (ownProps.id) {
                    //TODO specify path 'router.screens' ?
                    //TODO different path for all components 'app.components' ?
                    return state.router.screens[ownProps.id];
                }
                if (statePath) {
                    const res = getPropertiesBySelector(state, statePath);
                    if (res.length > 0) {
                        console.log('mapStateToProps ', res[0].value)
                        return res[0].value;
                    }
                }
                return {}
            }
        )
        //TODO displayName, to default props?
    )(Component);
}

//export default connect(mapStateToProps)(EngageApp);

/**
 * Regular compose function
 *
 * @param  {...function} enhancers - functions to compose
 */
function compose(...enhancers) {
    if (enhancers.length === 0) {
        return arg => arg
    }
    if (enhancers.length === 1) {
        return enhancers[0]
    }
    return enhancers.reduce((a, b) => (...args) => a(b(...args)))
}