export class ProxyFactory{

    static create(model, acao, props){
       return new Proxy(model, {
           get(target, prop, receiver){

            if(props.includes(prop) && ProxyFactory._ehFuncao(target[prop])){

                return function () {

                    let retorno = Reflect.apply(target[prop], target, arguments);
                    acao(target);
                    return retorno;
                }
            }

            return Reflect.get(target, prop, receiver);
           }
           ,set(target, prop, value, receiver){
               
               let retorno = Reflect.set(target, prop, value, receiver);
               if(props.includes(prop)) acao(target);// só executa acao(target) se for uma propriedade monitorada              
                return retorno;
           }
        });
    }

    static _ehFuncao(func) {
        return (typeof(func) == typeof (Function));
    }
}