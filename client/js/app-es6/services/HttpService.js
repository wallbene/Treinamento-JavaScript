export class HttpService{

    _handleErrors(res){
        if(!res.ok) throw new Error(res.statusText);
            return res;
    }

    get(url){
        return fetch(url)
            .then(res => this._handleErrors(res))
            .then(res => res.json());
        }
        
    post(url, dado){
        //fetch API
        return fetch(url, {
                headers: {'content-type' : 'application/json'},
                method: 'post',
                body: JSON.stringify(dado)})
            .then(res => this._handleErrors(res))
            .then(res => res.json());

        //vanila javascript
        /* return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.addEventListener("load", () => {
                
                if(xhr.readyState == XMLHttpRequest.DONE){                    
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.responseText));
                    }else{
                        reject(xhr.responseText);
                    }
                }
            });
            xhr.send(JSON.stringify(dado));//usando JSON.stringify para converter objeto em uma string no formato JSON.
        }); */

    }
}