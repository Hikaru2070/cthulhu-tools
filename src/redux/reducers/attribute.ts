import { Map } from 'immutable';
import { Attribute } from "models/status";
import { Action } from "redux/actions/root";
import { ATTRIBUTE_SET, ATTRIBUTE_DELETE } from "redux/actions/attribute";

export interface AttributeState {
	attributes: Map<string, Attribute>;
}

export function AttributeReducer(state: AttributeState = { attributes: Map() }, action: Action): AttributeState {
	switch (action.type) {
		case ATTRIBUTE_SET:
			{
				const { attribute } = action;
				const array = Array.isArray(attribute) ? attribute : [attribute];

				return { attributes: state.attributes.withMutations(s => array.forEach(attr => s.set(attr.uuid, attr))) };
			}
		case ATTRIBUTE_DELETE:
			{
				const { uuid } = action;
				const array = Array.isArray(uuid) ? uuid : [uuid];

				return { attributes: state.attributes.withMutations(s => array.forEach(uuid => s.delete(uuid))) };
			}
		default:
			return state;
	}
}