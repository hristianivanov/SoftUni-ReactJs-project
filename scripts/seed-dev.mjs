const DEFAULT_API_URL = 'http://localhost:3030';
const apiUrl = (process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || DEFAULT_API_URL).replace(/\/$/, '');

const demoUser = {
  email: 'demo@local.test',
  username: 'Demo Author',
  password: 'demo123',
};

const authorAvatar = '/img/author.jpg';
const imageUrl = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085';

const articles = [
  {
    title: 'Unit Testing and Modules',
    summary: 'A practical walkthrough of isolating JavaScript logic, arranging modules, and testing behavior without coupling your UI to implementation details.',
    content: 'Unit testing gives a project confidence while it is still small enough to change quickly. Start by extracting pure functions from UI components, keep module boundaries narrow, and test the behavior users depend on. A useful test describes the observable result, not every internal step. When modules communicate through clear inputs and outputs, refactoring becomes less dramatic and bugs become easier to pin down.',
    category: 'JavaScript',
    readingTime: 5,
    featured: true,
  },
  {
    title: 'REST Services and AJAX',
    summary: 'How client applications talk to REST APIs with fetch, JSON payloads, query strings, and helpful error handling.',
    content: 'Modern React apps usually depend on HTTP services for their real data. The native fetch API is enough for most portfolio projects when it is wrapped in one reliable requester. Keep endpoint construction inside services, encode query strings, await JSON parsing, and surface server errors as useful messages. This keeps components focused on rendering state instead of knowing transport details.',
    category: 'API',
    readingTime: 6,
    featured: true,
  },
  {
    title: 'Asynchronous Programming in React',
    summary: 'A clear pattern for loading, error, and empty states when effects request data from a server.',
    content: 'Asynchronous code is not only about promises. It is about the user experience while the promise is pending, failed, empty, or successful. React components should represent each state deliberately. A loading message prevents a blank page, an error message gives the user a path forward, and an empty state confirms that the app is working even when there is no data to show.',
    category: 'React',
    readingTime: 4,
    featured: false,
  },
  {
    title: 'Remote Databases for Front-End Projects',
    summary: 'What front-end developers need to know when moving from local static data to shared remote collections.',
    content: 'A remote database changes how a front-end project behaves. Data may arrive late, fail validation, or be changed by another user. Treat server collections as the source of truth, keep writes protected, and use stable ids for details and comments. Even a training server can teach the shape of production work when the client code is organized around services.',
    category: 'Backend',
    readingTime: 5,
    featured: false,
  },
  {
    title: 'Templating vs Components',
    summary: 'Why reusable components are the natural next step after learning static HTML templates.',
    content: 'Static templates are useful because they make layout visible. Components go further by turning repeated markup into reusable pieces with explicit data. A post card should not know one hard-coded title; it should know how to render any article. That shift is small, but it is the heart of building maintainable React interfaces.',
    category: 'React',
    readingTime: 3,
    featured: false,
  },
  {
    title: 'Routing Public Blog Pages',
    summary: 'Designing home, catalog, details, and not-found routes so a Vite app feels like a real website.',
    content: 'Routing turns a collection of components into an application. Public pages need stable URLs for the home page, catalog filters, article details, contact, and authentication screens. A wildcard route matters too, because unknown URLs should produce a helpful not-found screen instead of silence. With BrowserRouter, Vite development handles refreshes cleanly.',
    category: 'Routing',
    readingTime: 4,
    featured: true,
  },
  {
    title: 'Search and Category Filters',
    summary: 'Small client-side filters that make a content catalog easier to scan without adding backend complexity too early.',
    content: 'A blog catalog becomes more useful when visitors can narrow it by topic or search term. For a first milestone, client-side filtering is enough. Load the article collection once, derive the visible result from search and category state, and show the matching count. Keeping the query string in sync makes category cards shareable and refresh-friendly.',
    category: 'UX',
    readingTime: 4,
    featured: false,
  },
  {
    title: 'Designing Useful Empty States',
    summary: 'How loading, error, empty, and not-found states turn a fragile demo into a finished public experience.',
    content: 'A finished interface includes the moments when things are not perfect. Loading states tell visitors that work is happening. Error states explain what failed. Empty states guide the next action. Not-found states help people recover from a bad URL. These screens are small, but they make the difference between a static mockup and an application that can be used.',
    category: 'UX',
    readingTime: 3,
    featured: false,
  },
];

const comments = [
  'This helped connect the course examples with a real project structure.',
  'The loading and error state advice is especially useful for portfolio work.',
  'Clear explanation. I would like to see this expanded in a future article.',
  'The service layer idea keeps the components much cleaner.',
  'Good reminder that routing needs a proper not-found screen too.',
];

try {
  const user = await authenticateDemoUser();
  const existingArticles = await request('GET', '/data/articles').catch((error) => {
    if (/not found|404|resource/i.test(error.message)) {
      return [];
    }

    throw error;
  });

  if (Array.isArray(existingArticles) && existingArticles.length > 0) {
    console.log(`Seed skipped: ${existingArticles.length} articles already exist.`);
  } else {
    const createdArticles = [];

    for (const article of articles) {
      const created = await request('POST', '/data/articles', {
        ...article,
        imageUrl,
        authorName: demoUser.username,
        authorAvatar,
      }, user.accessToken);

      createdArticles.push(created);
    }

    for (let index = 0; index < comments.length; index += 1) {
      const article = createdArticles[index % createdArticles.length];

      await request('POST', '/data/comments', {
        articleId: article._id,
        text: comments[index],
        authorName: index % 2 === 0 ? 'Mira Petrova' : 'Alex Markov',
        authorAvatar,
      }, user.accessToken);
    }

    console.log(`Seeded ${createdArticles.length} articles and ${comments.length} comments.`);
    console.log(`Demo account: ${demoUser.email} / ${demoUser.password}`);
  }
} catch (error) {
  console.error(`Seed failed: ${error.message}`);
  process.exit(1);
}

async function authenticateDemoUser() {
  try {
    return await request('POST', '/users/register', demoUser);
  } catch (error) {
    if (!/exist|conflict|taken|409/i.test(error.message)) {
      throw error;
    }

    return request('POST', '/users/login', {
      email: demoUser.email,
      password: demoUser.password,
    });
  }
}

async function request(method, endpoint, data, token) {
  const options = {
    method,
    headers: {},
  };

  if (data !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  if (token) {
    options.headers['X-Authorization'] = token;
  }

  const response = await fetch(`${apiUrl}${endpoint}`, options);

  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get('content-type') || '';
  const result = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof result === 'object' && result !== null
      ? result.message || 'Request failed'
      : result || 'Request failed';

    throw new Error(message);
  }

  return result;
}
