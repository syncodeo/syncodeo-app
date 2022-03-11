import { message } from "antd";
import translate from "../localization";

export function copyToClipboard(value: string) {
    const el = document.createElement('textarea');
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    message.success(translate('urlCopiedClipboard'));
}