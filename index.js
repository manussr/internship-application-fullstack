class ElementHandler {
  constructor(variant_opt){
    this.variant_opt=variant_opt;
  }


  element(element) {
    if(this.variant_opt==="variant-1"){
      if(element.tagName==="title"){
        element.setInnerContent("First sample title")
      }
      if(element.tagName==="h1" && element.getAttribute("id")==="title"){
        element.setInnerContent("Variant One")
      }
      if(element.tagName==="p" && element.getAttribute("id")==="description"){
        element.setInnerContent("Insert a insightful description for this page")
      }
      if(element.tagName==="a" && element.getAttribute("id")==="url"){
        element.setAttribute("href", "https://www.linkedin.com/in/emmanuel-santos-rodr%C3%ADguez-a5923b185/")
        element.setInnerContent("Go to my LinkedIn profile")
      }
    }
    else{
      if(element.tagName==="title"){
        element.setInnerContent("Second sample title")
      }
      if(element.tagName==="h1" && element.getAttribute("id")==="title"){
        element.setInnerContent("Variant Strikes Back")
      }
      if(element.tagName==="p" && element.getAttribute("id")==="description"){
        element.setInnerContent("Stay home, stay safe")
      }
      if(element.tagName==="a" && element.getAttribute("id")==="url"){
        element.setAttribute("href", "https://github.com/manussr")
        element.setInnerContent("Visit my Github page")
      }
    }
  }
}




addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  return redirect(request);
}

async function redirect(request){
  try{
    let opt
    const url='https://cfw-takehome.developers.workers.dev/api/variants'
    let response = await fetch(url);
    let data = await response.json(); 
    let variants=data.variants
    const cookie = request.headers.get('cookie')
    const NAME = 'cf-int'
    if (cookie && cookie.includes(`${NAME}=variant-1`)) {
      opt = "variant-1"
    } else {
      if (cookie && cookie.includes(`${NAME}=variant-2`)) {
        opt = "variant-2"
      } else {
        if(Math.random()>=0.5){
          opt="variant-1"
        }else{
          opt="variant-2"
        }
      }
    }
    let result
    if(opt==="variant-1"){
      result=await fetch(variants[0])
    }else{
      result=await fetch(variants[1])
    }
    results=new Response(result.body, result)
    results.headers.append('Set-Cookie', `${NAME}=${opt}; path=/`)
    //Modifying variants
    var rewriter = new HTMLRewriter();
    rewriter.on('*', new ElementHandler(opt));
    var transformed = rewriter.transform(results);
    return transformed
  }catch(error){
    return new Response(error.stack||error)
  }
}


