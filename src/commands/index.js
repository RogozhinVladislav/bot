import _ from "lodash";
import { PORT, CONFIRMATION, TOKEN, ACCESS_TOKEN } from "../../config";

export function malyava({ updates, api, snippets }) {
    return updates.hear(/малява в хату (\d+)\s+(.*)/i, async (context) => {
        debugger
        await api.messages.send({
            peer_id: 2000000000 + Number(context.$match[1]),
            random_id: context.payload.random_id,
            message: `Пришла малява из хаты №${context.chatId} c следующим содержанием: ${context.$match[2]}`,
        });
    
        await context.send(`Малява отправлена`);
    });
}


export function discoverId({ updates, api, snippets }) {
    return updates.hear('номер хаты', async (context) => {
        await context.send(`Хата №${context.chatId}`);
    });
}

export function Lyapos({ updates, api, snippets }) {
    return updates.hear(/^ляпоса (.+)/i, async (context) => {
        const userResource = await snippets.resolveResource(context.$match[1]);
        const user = await api.users.get({ user_id: userResource.id })
        await context.send(`${user[0].first_name} был попущен`);
    });
}

export function randomPhotoFromGroup({ updates, api, snippets }) {
    const isPhoto = (post) => {
        const attachments = post && post.attachments
        return attachments && attachments.find(attachment => attachment.type === 'photo')
    }
    
    const getRanomPostWithPhoto = (items) => {
        let post = _.sample(items)
    
        return isPhoto(post) ? post : getRanomPostWithPhoto()
    }
    
    updates.hear('/фото', async (context) => {
    
        const response = await api.wall.get({
            owner_id: `-${context.$groupId}`,
            access_token: ACCESS_TOKEN,
            count: 100
        });
    
        const post = getRanomPostWithPhoto(response.items)
    
        const photos = post.attachments.filter(attachment => attachment.type === 'photo')
        const photo = _.sample(photos).photo
        const str = `photo${photo.owner_id}_${photo.id}`
        
        await Promise.all([	
            context.send('', { attachment: str })
        ]);
    });
    
}

export default function (vk) {
    malyava(vk)
    discoverId(vk)
    Lyapos(vk)
    randomPhotoFromGroup(vk)
}