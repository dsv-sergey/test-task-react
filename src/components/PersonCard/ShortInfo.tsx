import React from "react";
import { FlexRow } from "@epam/uui";
import { TShortInfo } from "../../types";
import { snakeCaseToTitleCase } from "../../utils";
import { usePlanet } from "../../hooks";
import { Text } from "../shared";
import { personShortInfoFields } from "../../constants";

export const ShortInfo = (props: TShortInfo) => {
    const planetQuery = usePlanet(props.homeworld);
    const planet = planetQuery.isFetching ? "Loading..." : planetQuery.data?.name;

    const fields = personShortInfoFields.map((field) => {
        const titleCaseKey = snakeCaseToTitleCase(field);
        const info = field === "homeworld" ? planet : props[field];

        return (
            <FlexRow key={ field } padding="24" columnGap="12">
                <Text fontWeight="400" color="secondary">{ `${titleCaseKey}:` }</Text>
                <Text fontSize="16" fontWeight="400">{ info }</Text>
            </FlexRow>
        );
    });

    return (<>{ fields }</>);
};
