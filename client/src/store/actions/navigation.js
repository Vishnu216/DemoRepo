import { EXPANDED } from './types'

export const setExpanded = (expanded) => (dispatch) => {
   dispatch({
      type: EXPANDED,
      payload: expanded,
   })
}
