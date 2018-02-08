import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import SizeMixin, { mixin } from "mixins/size";

@Component
export default class DiceNumberDisplay extends mixin(Vue, SizeMixin) {
	@Prop({ required: true })
	public digits: number;

	@Prop()
	public value?: number;

	@Prop({ default: false })
	public critical: boolean;

	@Prop({ default: false })
	public fumble: boolean;

	private font: string = "";

	public get textAspectRatio(): number {
		return this.getTextAspectRatio();
	}

	public get fontSize(): number {
		return this.getFontSize();
	}

	protected mounted(): void {
		this.font = window.getComputedStyle(this.$el).font || "";
	}

	private getFontSize(): number {
		const efficientHeight = this.height * 0.5;
		if (this.width / efficientHeight > this.textAspectRatio) {
			return efficientHeight;
		} else {
			return this.width / this.textAspectRatio;
		}
	}

	private getTextAspectRatio(): number {
		const height = 100;
		const font = this.font.replace(/\d+px/, `${height}px`);
		const text = "0".repeat(this.digits);
		const width = this.measure(text, font);
		return (width / height);
	}

	private measure(text: string, font: string) {
		const canvas = document.createElement('canvas');
		canvas.width = 0;
		canvas.height = 0;

		const context = canvas.getContext('2d') as CanvasRenderingContext2D;
		context.font = font;

		return context.measureText(text).width;
	}
}