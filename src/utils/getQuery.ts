export const getQuery = ({
    page,
    search,
}: {
    page?: number;
    search?: string;
}) => {
    const params = new URLSearchParams();
    page && params.append('page', page.toString());
    search && params.append('search', search);
    return params.toString();
};
