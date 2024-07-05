import React from "react";
import { FlexCell, FlexRow, LabeledInput, Panel, TextInput } from "@epam/uui";
import { IEditable, ILens } from "@epam/uui-core";
import { stringTypeFields } from "../../constants";
import { IPerson } from "../../types";
import { snakeCaseToTitleCase } from "../../utils";
import { HomeworldForm } from "./HomeworldForm";
import { FilmsForm } from "./FilmsForm";
import { SpeciesForm } from "./SpeciesForm";
import { StarshipsForm } from "./StarshipsForm";
import { VehiclesForm } from "./VehiclesForm";
import css from "./PersonForm.module.scss";

interface PersonFormProps {
    lens: ILens<IPerson>;
}

export const PersonForm = (props: PersonFormProps) => {
    const { lens } = props;

    const simpleFields = stringTypeFields.map((field) => {
        const titleCaseKey = snakeCaseToTitleCase(field);

        return (
            <FlexRow key={ field } vPadding="12">
                <FlexCell grow={ 1 }>
                    <LabeledInput label={ titleCaseKey } { ...lens.prop(field).toProps() }>
                        <TextInput size="48" mode="inline" placeholder={ titleCaseKey } { ...lens.prop(field).toProps() as IEditable<string> } />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
        );
    });

    return (
        <Panel shadow background="surface-main" rawProps={ { style: { padding: "24px", margin: "24px 0" } } }>
            <FlexCell cx={ css.personForm } width="100%">
                <SpeciesForm lens={ lens.prop("species") } />
                { simpleFields }
                <HomeworldForm lens={ lens.prop("homeworld") } />
                <FilmsForm lens={ lens.prop("films") } />
                <StarshipsForm lens={ lens.prop("starships") } />
                <VehiclesForm lens={ lens.prop("vehicles") } />
            </FlexCell>
        </Panel>
    );
};
