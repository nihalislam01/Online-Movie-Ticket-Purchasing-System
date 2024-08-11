import { Helmet, HelmetProvider } from 'react-helmet-async';

function CommonHelmet(props) {
    return (
        <HelmetProvider>
            <Helmet>
                <title>{props.title}</title>
            </Helmet>
        </HelmetProvider>
    );
}

export default CommonHelmet;