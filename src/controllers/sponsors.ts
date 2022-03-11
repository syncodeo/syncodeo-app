import { request } from '../helpers/requests';
import Sponsor from '../interfaces/Sponsor';
import LastSponsor from '../interfaces/LastSponsor';

export function donate(stripeToken: string, stripeEmail: string, amount: number): Promise<{ data: Object }> {
    console.log("TEST");
    return request({
        url: 'donate',
        method: 'POST',
        data: {
            stripeToken,
            stripeEmail,
            amount
        }
    });
}

export function getLastSponsors(): Promise<LastSponsor[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([{
                name: 'SCARPELLINO Giovanni',
                amount: 150,
                link: 'https://giovanniscarpellino.github.io',
                message: 'Ceci est mon message qui doit être grand afin que je puisse regarder comment ça le fait si le message est grand mdrr des barres de rire',
            }, {
                name: 'PENELON pierre',
                amount: 150,
                link: 'https://penelonpierre.github.io',
                message: 'A',
            }, {
                name: "DQZDQZDQZDHQZUDH QZUDH UQZHD UQZH DQZD HNUQZD QZ DQDz",
                amount: 99999,
            }] as LastSponsor[])
        }, 1000);
    });
}

export function getAllSponsors(): Promise<Sponsor[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([{
                name: 'Giovanni SCARPELLINO',
                email: 'scarpellino.giovanni@gmail.com',
                amounts: [150, 400, 1950, 10],
                links: ['https://giovanniscarpellino.github.io'],
                messages: ['Ceci est mon message très très long afin de voir comment ça fait :D'],
            }, {
                name: 'Pierre PENELON',
                email: 'penelon.pierre@gmail.com',
                amounts: [199, 500],
            }] as Sponsor[])
        }, 1000);
    });
} 