import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import AppPage from "@component/page";

@Component({
	components: {
		AppPage,
	}
})
export default class CharacterEditPage extends Vue { }