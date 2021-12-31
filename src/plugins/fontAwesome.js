import { faCamera, faGlobe, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faPencilAlt, faGlobe, faCamera)

export default (app) => {
  app.component('fa', FontAwesomeIcon)
}