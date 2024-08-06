export default async function requester(method, url, data) {
    const options = {};

    if (method !== 'GET') {
        options.method = method;
    }

    if(data){
        options.header = {
            'Content-Type': 'application/json',
        };

        options.body = JSON.stringify(data);

        const response = await fetch(url,options);
        const result = response.json();

        return result;
    }
}