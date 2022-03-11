import React from 'react';
import './LogoHome.less';

interface IProps {

}

interface IState {

}

export default class LogoHome extends React.Component<IProps, IState>{
    componentDidMount() {
        let logo = document.getElementById('logo-home');
        let logoX = 0;
        let logoY = 0;

        document.onmousemove = function (e) {
            let mouseX = e.clientX;
            let mouseY = e.clientY;

            let coefX = mouseX / window.innerWidth;
            let coefY = mouseY / window.innerHeight;

            let offsetX = (coefX - 0.5) * 125;
            let offsetY = (coefY - 0.5) * 100;

            offsetX = Math.round(offsetX * 100) / 100;
            offsetY = Math.round(offsetY * 100) / 100;

            logoX += (offsetX - logoX) / 5;
            logoY += (offsetY - logoY) / 5;

            logo.style.transform = `translate(${logoX}px, ${logoY}px)`;
        }
    }

    render() {
        return (
            <img className="noselect" src={require('../../../img/logo/menu/logo.png')} alt="logo" id="logo-home" />
        )
    }
}