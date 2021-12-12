import { faGlobe, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faPencilAlt)
library.add(faGlobe)
export default (app) => {
  app.component('fa', FontAwesomeIcon)
}