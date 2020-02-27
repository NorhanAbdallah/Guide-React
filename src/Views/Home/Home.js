import React from 'react';
import MainPhotoComp from "./MainPhoto";
import Services from "./Services.js"
import { Container } from "reactstrap"
import AboutUs from "./AboutUs"
import ContactUs from "./ContactUs"
import Download from "./DownLoad"
class Home extends React.Component {
// <<<<<<< HEAD
//     componentWillMount(){
// =======
    componentWillMount() {
        //  Bashandy add to start at every page from top
// >>>>>>> 0a0ea3439694a30f8c41e8c1ec10074d9531e59e
        window.scrollTo(0, 0);
    }
    render() {
        return (
            <Container fluid >
                <MainPhotoComp />
                <Services />
                <AboutUs />
                <ContactUs />
                <Download />
            </Container>
        )
    }
}
export default (Home);