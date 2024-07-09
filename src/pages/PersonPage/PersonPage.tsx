import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useUuiContext } from '@epam/uui-core';
import {
    SuccessNotification,
    WarningNotification,
    useForm,
    Text,
    FlexRow,
    Button,
    LinkButton,
    FlexSpacer,
    Blocker,
    ScrollBars,
} from '@epam/uui';
import { usePerson } from '../../hooks';
import { Header } from '../../layout';
import { IPerson, PersonsRequest } from '../../types';
import { PersonForm } from '../../components';
import { default as BackIcon } from '@epam/assets/icons/common/navigation-back-24.svg?react';
import { PAGINATION, PEOPLE_KEY, PEOPLE_PAGE_KEY } from '../../constants';
import css from './PersonPage.module.scss';

export const PersonPage = () => {
    const { uuiRouter, uuiNotifications } = useUuiContext();
    const queryClient = useQueryClient();
    const personId = uuiRouter
        .getCurrentLink()
        .pathname.split('/')
        .filter((v) => v !== '')
        .pop();
    const query = usePerson(personId);
    const history = useHistory();

    const { lens, save, replaceValue, isChanged } = useForm<IPerson>({
        value: query.data,
        onSave: (state) => {
            queryClient.setQueryData<IPerson>(
                [PEOPLE_KEY, state.url],
                (input) => {
                    return {
                        ...input,
                        ...state,
                    };
                },
            );
            const page = Math.ceil(
                +(personId as string) / PAGINATION.ITEMS_PER_PAGE,
            );
            const pageData = queryClient.getQueryData([PEOPLE_PAGE_KEY, page]);
            if (pageData) {
                queryClient.setQueryData(
                    [PEOPLE_PAGE_KEY, page],
                    (input: PersonsRequest) => {
                        return {
                            ...input,
                            results: [
                                ...input.results.map((value: IPerson) => {
                                    return value.url === state.url
                                        ? state
                                        : value;
                                }),
                            ],
                        };
                    },
                );
            }

            return Promise.resolve({ form: state });
        },
        onSuccess: () =>
            uuiNotifications
                .show((props) => (
                    <SuccessNotification {...props}>
                        <Text>Form saved</Text>
                    </SuccessNotification>
                ))
                .catch(() => null),
        getMetadata: () => ({
            props: {
                birth_year: {
                    isRequired: true,
                },
                height: {
                    isRequired: true,
                },
                mass: {
                    isRequired: true,
                },
            },
        }),
    });

    const goBack = () => {
        if (isChanged) {
            uuiNotifications
                .show((props) => (
                    <WarningNotification {...props}>
                        <Text>Firstly, you need to save the form</Text>
                    </WarningNotification>
                ))
                .catch(() => null);
        } else {
            history.goBack();
        }
    };

    useEffect(() => {
        replaceValue(query.data);
    }, [query.isFetched, query.data, replaceValue]);

    const getTitle = () => (
        <>
            <LinkButton
                cx={css.backButton}
                icon={BackIcon}
                onClick={goBack}
                color="white"
                size="48"
                caption="Back"
            />
            {query.data?.name}
        </>
    );

    return (
        <div className={css.wrapper}>
            <Header title={getTitle()} />
            {query.data && (
                <div className={css.content}>
                    <ScrollBars>
                        <div className={'container'}>
                            <PersonForm lens={lens} />
                        </div>
                    </ScrollBars>
                    <div className={css.footerShadow}>
                        <div className={'container'}>
                            <FlexRow vPadding="24">
                                <FlexSpacer />
                                <Button
                                    isDisabled={!isChanged}
                                    caption="Save"
                                    onClick={save}
                                />
                            </FlexRow>
                        </div>
                    </div>
                </div>
            )}
            <Blocker isEnabled={query.isFetching || query.isLoading} />
        </div>
    );
};
