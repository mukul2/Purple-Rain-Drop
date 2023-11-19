 <div class=" rounded-lg border border-gray-300 bg-white px-6 py-1 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 m-3">
      <div class="flex-shrink-0">
      <a  href="/doctors/{post.id}">
    <li class="flex justify-between gap-x-6 py-2 bg-white">
      <div class="flex" >
        <span class="relative inline-block p-1">
          <img class="h-32 w-32 object-cover rounded-md" src={post.photo} alt="">
          <span class="{post.online==1?'absolute right-0 top-0 block h-4 w-4 rounded-full bg-green-400 ring-2 ring-white':'absolute right-0 top-0 block h-4 w-4 rounded-full bg-grey-400 ring-2 ring-white'}"></span>
        </span>
         <div class="min-w-0 flex-auto ml-2">
          <p class="text-sm font-semibold leading-6 text-gray-900">{post.name}</p>
          <p class="mt-1 truncate text-xs leading-5 text-gray-500">{getEducationString(post.education)}</p>
          <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mt-1">{post.department[0]}</span>
          <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{post.department[1]}</span>

         
         
        </div>
      </div>
      <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end w-30">
        <p class="text-sm leading-6 text-gray-900">Working in</p>
        <p class="text-sm font-semibold leading-6 text-gray-900">{getWorkString(post.work)}</p>
        <p class="text-sm leading-6 text-gray-900">Total Ratings({post.ratings.total??0})</p>
        <div class="flex items-center">
          {#each {length: getRating(post.ratings.ave)} as _, i}
          <svg class="text-yellow-400 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
          </svg>
            {/each}
        </div>
        
      </div>
      <div class="shrink-0 sm:flex sm:flex-col sm:items-end w-22" >
        <h1 class="text-1xl font-bold tracking-tight text-gray-900">Consultation Fees</h1>
        <p class="text-3xl tracking-tight text-gray-900"> ৳ {post.fees}</p>
        <button type="button" class="rounded bg-green-600 px-2 py-1 mt-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
         
          <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg> -->
          
          See Doctor Now
        </button>
      </div>
    </li>
   

            </a>
          </div>
          </div>
