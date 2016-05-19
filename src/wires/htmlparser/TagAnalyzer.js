"use realm";

import State from wires.htmlparser;

const TAG_OPENED = "1";
const TAG_CLOSING = "2";
const TAG_CLOSED = "3";
const TAG_CREATED = "4";
const TAG_OPENING = "5";
const TAG_TEXT_OPENING = "6";
const TAG_TEXT = "7";
const TAG_TEXT_END = "8";

class TagAnalyzer {
   constructor() {
      this.state = new State();
   }

   /**
    * isCreated - returns true or false based on it tag has been just created
    * Triggers only once
    *
    * @return {type}  description
    */
   isCreated() {
      return this.state.has(TAG_CREATED);
   }

   /**
    * isOpened - if a tag has been opened (meaning that everything beetween <> will get there)
    *
    * @return {type}  description
    */
   isOpened() {
      return this.state.has(TAG_OPENED);
   }

   /**
    * isClosed - when a tag is closed
    *
    * @return {type}  description
    */
   isClosed() {
      return this.state.has(TAG_CLOSED);
   }

   /**
    * isText - if text can be consumed
    *
    * @return {type}  description
    */
   isText() {
      return this.state.has(TAG_TEXT);
   }

   /**
    * isTextEnd - when text consuming should be ended
    *
    * @return {type}  description
    */
   isTextEnd() {
      return this.state.has(TAG_TEXT_END);
   }

   /**
    * analyze - analyzer, set states based on known/existing states
    *
    *
    * @param  {type} i description
    * @return {type}   description
    */
   analyze(i) {
      var state = this.state;

      if (state.has(TAG_TEXT_OPENING)) {
         state.set(TAG_TEXT);
      }
      state.clean(TAG_CLOSED, TAG_TEXT_END, TAG_TEXT_OPENING);

      if (i === "/") {
         state.set(TAG_CLOSING);
         state.unset(TAG_OPENING, TAG_OPENED)
      }

      if (state.has(TAG_CREATED)) {
         state.unset(TAG_CREATED);
         state.set(TAG_OPENED);
      }
      if (state.has(TAG_OPENING)) {
         state.set(TAG_CREATED)
         state.unset(TAG_OPENING);
      }
      if (i === "<") {
         if (!state.has(TAG_OPENED)) {
            state.set(TAG_OPENING);
         }
         if (state.has(TAG_TEXT)) {
            state.set(TAG_TEXT_END);
         }
         state.unset(TAG_TEXT, TAG_TEXT_OPENING);
      }
      if (i === ">") {
         state.set(TAG_TEXT_OPENING);
         if (state.once(TAG_CLOSING)) {
            state.unset(TAG_OPENED);
            return state.set(TAG_CLOSED)
         }
         if (state.has(TAG_OPENED)) {
            state.unset(TAG_OPENED)
         }
      }
   }
}
export TagAnalyzer;
