import { ErrorMessage, Field, Form, configure, defineRule } from "vee-validate"
import { collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, startAfter, where } from "firebase/firestore"
import { email, min, required, url } from "@vee-validate/rules"

import { db } from "../main"
import { localize } from "@vee-validate/i18n"

export default (app) => {
  defineRule('required', required)
  defineRule('email', email)
  defineRule('min', min)
  defineRule('url', url)
  defineRule('unique', async (value, args) => {
    let mycollection, field, excluding
    if (Array.isArray(args)) {
      [mycollection, field, excluding] = args
    }
    else {
      ({mycollection, field, excluding} = args)
    }
    if (value === excluding) return true
    const q = query(collection(db, mycollection), where(field, "==", value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty
  })
  configure({
    generateMessage: localize('en', {
      messages: {
        required: "This {field} is required.",
        email: "The {field} provided is not valid.",
        min: '{field} must be a minimum of 0:{min} characters',
        unique: '{field} is already taken',
        url: '{field} must be a valid URL'
        
      }
    })
  })

  app.component('VeeForm', Form)
  app.component('VeeField', Field)
  app.component('VeeErrorMessage', ErrorMessage)
}