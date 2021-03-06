import { App } from 'koishi-core';
import { CQCode } from 'koishi-utils';
import superagent from 'superagent';

export function apply(app: App) {
    app.command('tools', '实用工具');

    app.command('tools/ocr [image]', { minInterval: 3000, cost: 3 })
        .action(async ({ session }, image) => {
            if (!image) {
                await session.$sendQueued('请发送图片。');
                image = await session.$prompt(30000);
            }
            if (!image) return '没有检测到图片。';
            const img = CQCode.parse(image);
            const res = await superagent.get(`https://ai.qq.com/cgi-bin/appdemo_imagetranslate?image_url=${img.data.url}`);
            if (res.body.ret !== 0) return res.body.msg;
            return res.body.data.image_records.map((node) => node.source_text).join('');
        });
}
