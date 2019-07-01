
import eventBus from '@/event'
import { eventCollection } from '@/event/resources'

export const menuMixin = {
  data() {
    return {
      menuexpand: false
    }
  },
  methods: {
    togMenu() {
      this.menuexpand = !this.menuexpand;
      eventBus.$emit(eventCollection.CHANGE_MENU_EXPAPND);
    }
  }
}