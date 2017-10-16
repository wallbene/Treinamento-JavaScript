
    const stores = ['negociacoes'];
    const version = 5;
    const dbName = 'aluraFrame';
    
    let connection = null;
    
    let close = null;

    export class ConnectionFactory{
    
        constructor(){
            throw new Error("não é possível criar instâncias de ConnectionFactory");
        }
    
        static getConnection(){
            return new Promise((resolve, reject) => {
    
                let openRequest = window.indexedDB.open(dbName, version);
    
                openRequest.onupgradeneeded = e =>{
    
                    ConnectionFactory._criaStores(e.target.result);
                    
                };
                
                openRequest.onsuccess = e => {
                    
                    if(!connection) {

                        connection = e.target.result;
                        close = connection.close.bind(connection);
                        connection.close = function(){
                            throw new Error("esse método não pode ser invocado");
                        };                        
                    }
                    // recebe conexão já existente ou uma que acabou de ser criada
                    resolve(connection);
                    
                };
                
                openRequest.onerror = e => {
                    
                    console.log(e.target.error);
                    
                    reject(e.target.error.name);
                    
                };
            });
        }
        
        static _criaStores(connection){
            
            stores.forEach(store => {
                
                if(connection.objectStoreNames.contains(store))
                    connection.deleteObjectStore(store);                
                connection.createObjectStore(store, {autoIncrement: true});
            });
    
        }
        static closeConnection(){
            close();
            connection = null;
        }
    }