/**
 * Mock Movie Data — Fallback when TMDB API is unreachable
 */
const MockData = (() => {
    const movies = [
        {id:278,title:"The Shawshank Redemption",overview:"Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.",poster_path:"/9cjIGRiQI5PGHt3pZkwDEhBjAEP.jpg",backdrop_path:"/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",vote_average:8.7,vote_count:26000,popularity:95,release_date:"1994-09-23",genre_ids:[18,80]},
        {id:238,title:"The Godfather",overview:"Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.",poster_path:"/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",backdrop_path:"/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",vote_average:8.7,vote_count:19500,popularity:98,release_date:"1972-03-14",genre_ids:[18,80]},
        {id:680,title:"Pulp Fiction",overview:"A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",poster_path:"/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",backdrop_path:"/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",vote_average:8.5,vote_count:26800,popularity:85,release_date:"1994-09-10",genre_ids:[53,80]},
        {id:155,title:"The Dark Knight",overview:"Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations.",poster_path:"/qJ2tW6WMUDux911BTUgMe1ST0gg.jpg",backdrop_path:"/nMKdUUepR0i5zn0y1T4CsSB5eld.jpg",vote_average:8.5,vote_count:31500,popularity:110,release_date:"2008-07-16",genre_ids:[28,80,18,53]},
        {id:550,title:"Fight Club",overview:"A ticking-Loss bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",poster_path:"/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",backdrop_path:"/hZkgoQYus5dXo3H8T7Uef6DNknx.jpg",vote_average:8.4,vote_count:28000,popularity:88,release_date:"1999-10-15",genre_ids:[18,53]},
        {id:13,title:"Forrest Gump",overview:"A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do.",poster_path:"/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",backdrop_path:"/ghgfzbEV7kbpbi1s4OUBG74MrKT.jpg",vote_average:8.5,vote_count:26000,popularity:82,release_date:"1994-06-23",genre_ids:[35,18,10749]},
        {id:120,title:"The Lord of the Rings: The Fellowship of the Ring",overview:"Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator.",poster_path:"/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",backdrop_path:"/pIUvQ9Ed35wlWhY2oU6OmwEgzjS.jpg",vote_average:8.4,vote_count:23500,popularity:92,release_date:"2001-12-18",genre_ids:[12,14,28]},
        {id:603,title:"The Matrix",overview:"Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",poster_path:"/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",backdrop_path:"/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",vote_average:8.2,vote_count:24500,popularity:87,release_date:"1999-03-30",genre_ids:[28,878]},
        {id:157336,title:"Interstellar",overview:"The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",poster_path:"/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",backdrop_path:"/xJHokMbljXjADYdit5fK1B4FkLy.jpg",vote_average:8.4,vote_count:34000,popularity:105,release_date:"2014-11-05",genre_ids:[12,18,878]},
        {id:27205,title:"Inception",overview:"Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible.",poster_path:"/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",backdrop_path:"/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",vote_average:8.4,vote_count:35500,popularity:100,release_date:"2010-07-15",genre_ids:[28,878,12]},
        {id:11,title:"Star Wars",overview:"Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable droid duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire.",poster_path:"/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",backdrop_path:"/zqkmTXzjkAgXmEWLRsY4UpTWCeo.jpg",vote_average:8.2,vote_count:19500,popularity:90,release_date:"1977-05-25",genre_ids:[12,28,878]},
        {id:429,title:"The Good, the Bad and the Ugly",overview:"While the Civil War rages on between the Union and the Confederacy, three men – a quiet loner, a ruthless hitman, and a Mexican bandit – comb the American Southwest in search of a strongbox containing $200,000 in stolen gold.",poster_path:"/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg",backdrop_path:"/uIF5ybFnTCbiHWNMmyP1yD3wnXE.jpg",vote_average:8.5,vote_count:8000,popularity:55,release_date:"1966-12-23",genre_ids:[37]},
        {id:424,title:"Schindler's List",overview:"The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.",poster_path:"/sF1U4EUQS8YHUYjNl3N72HoISmB.jpg",backdrop_path:"/loRmRzQXZV0Z4XPVhMlBNOhjOZ3.jpg",vote_average:8.6,vote_count:15500,popularity:70,release_date:"1993-12-15",genre_ids:[18,36,10752]},
        {id:389,title:"12 Angry Men",overview:"The defense and the prosecution have rested and the jury is filing into the jury room to decide if a young Spanish-American is guilty or innocent of murdering his father.",poster_path:"/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg",backdrop_path:"/qqHQsStV6exghCM7zbObuYBiYxw.jpg",vote_average:8.5,vote_count:8000,popularity:45,release_date:"1957-04-10",genre_ids:[18]},
        {id:497,title:"The Green Mile",overview:"A supernatural tale set on death row in a Southern prison, where gentle giant John Coffey possesses the mysterious power to heal people's ailments.",poster_path:"/velWPhVMQeQKcxggNEU8YmIo52R.jpg",backdrop_path:"/l6hQWH9eDksNJNiXWYRkWqikOdu.jpg",vote_average:8.5,vote_count:16500,popularity:75,release_date:"1999-12-10",genre_ids:[14,18,80]},
        {id:122,title:"The Lord of the Rings: The Return of the King",overview:"Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor from Sauron's forces.",poster_path:"/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",backdrop_path:"/pm0RiwNpSja8gR0BTWpxo5a9Bbl.jpg",vote_average:8.5,vote_count:23000,popularity:88,release_date:"2003-12-01",genre_ids:[12,14,28]},
        {id:244786,title:"Whiplash",overview:"Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.",poster_path:"/7fn624j5lj3xTme2SgiLCeuedmO.jpg",backdrop_path:"/fRGxZuo7jJUWQsVg9PREb98Aclp.jpg",vote_average:8.4,vote_count:14000,popularity:65,release_date:"2014-10-10",genre_ids:[18,10402]},
        {id:637,title:"Life Is Beautiful",overview:"A touching story of an Italian book seller of Jewish ancestry who lives in his own little fairy tale. His creative and happy life takes a turn when his entire family is deported to a concentration camp during World War II.",poster_path:"/74hLDKjD5aGYOotO6esUVaeISa2.jpg",backdrop_path:"/bORe0eI72D874TMawOOFvqWS6Xe.jpg",vote_average:8.5,vote_count:12500,popularity:60,release_date:"1997-12-20",genre_ids:[35,18]},
        {id:496243,title:"Parasite",overview:"All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",poster_path:"/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",backdrop_path:"/TU9GAN4V2bXWBz2CE2RUbiSGkUD.jpg",vote_average:8.5,vote_count:17500,popularity:90,release_date:"2019-05-30",genre_ids:[35,53,18]},
        {id:372058,title:"Your Name",overview:"High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places.",poster_path:"/q719jXXEzOoYaps6babgKnONONX.jpg",backdrop_path:"/dIWwZW7dJJtqC6CgWzYkNVKIUm2.jpg",vote_average:8.5,vote_count:11000,popularity:70,release_date:"2016-08-26",genre_ids:[16,10749,18]},
        {id:569094,title:"Spider-Man: Across the Spider-Verse",overview:"After reuniting with Gwen Stacy, Brooklyn's full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse.",poster_path:"/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",backdrop_path:"/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",vote_average:8.4,vote_count:6500,popularity:120,release_date:"2023-05-31",genre_ids:[16,28,12]},
        {id:346698,title:"Barbie",overview:"Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",poster_path:"/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",backdrop_path:"/nHf61UzkfFno5X1ofIhugCPus2R.jpg",vote_average:7.0,vote_count:8000,popularity:130,release_date:"2023-07-19",genre_ids:[35,12,14]},
        {id:872585,title:"Oppenheimer",overview:"The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",poster_path:"/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",backdrop_path:"/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg",vote_average:8.1,vote_count:9000,popularity:125,release_date:"2023-07-19",genre_ids:[18,36]},
        {id:786892,title:"Furiosa: A Mad Max Saga",overview:"As the world fell, young Furiosa is snatched from the Green Place of Many Mothers and falls into the hands of a great Biker Horde led by the Warlord Dementus.",poster_path:"/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",backdrop_path:"/shrwC6U8Bkst9c9SnMSKGwLtLsa.jpg",vote_average:7.6,vote_count:3500,popularity:115,release_date:"2024-05-22",genre_ids:[28,12,878]},
        {id:693134,title:"Dune: Part Two",overview:"Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",poster_path:"/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",backdrop_path:"/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",vote_average:8.2,vote_count:5500,popularity:135,release_date:"2024-02-27",genre_ids:[878,12,28]},
        {id:940721,title:"Godzilla x Kong: The New Empire",overview:"Following their fruit battle against Mechagodzilla, Godzilla and Kong join forces to confront a colossal undiscovered threat hidden within our world.",poster_path:"/z1p34vh7dEOnLDaSZpMPB4TaasH.jpg",backdrop_path:"/veIyxxi5Gs8gvztLEW1Ysb8rrzs.jpg",vote_average:7.0,vote_count:3000,popularity:110,release_date:"2024-03-27",genre_ids:[28,878,12]},
        {id:438631,title:"Dune",overview:"Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe.",poster_path:"/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",backdrop_path:"/eeijXm3553xvuFalFRNCtHh7oOO.jpg",vote_average:7.8,vote_count:11500,popularity:85,release_date:"2021-09-15",genre_ids:[878,12]},
        {id:533535,title:"Deadpool & Wolverine",overview:"A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him.",poster_path:"/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",backdrop_path:"/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",vote_average:7.7,vote_count:5000,popularity:140,release_date:"2024-07-24",genre_ids:[28,35,878]},
        {id:1184918,title:"The Wild Robot",overview:"After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island. To survive the harsh environment, Roz bonds with the island's animals.",poster_path:"/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg",backdrop_path:"/mQZJoIhTEkNhCYAqcHrQqhENLdu.jpg",vote_average:8.4,vote_count:3000,popularity:100,release_date:"2024-09-12",genre_ids:[16,878,10751]},
        {id:76341,title:"Mad Max: Fury Road",overview:"An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken.",poster_path:"/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",backdrop_path:"/phszHPFVhPHhMZgo0fWTKBDQsJA.jpg",vote_average:7.6,vote_count:22000,popularity:70,release_date:"2015-05-13",genre_ids:[28,12,878]},
        {id:19995,title:"Avatar",overview:"In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission.",poster_path:"/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",backdrop_path:"/o0s4XsEDfDlvit5pDRKjzXR4pp2.jpg",vote_average:7.6,vote_count:30000,popularity:80,release_date:"2009-12-15",genre_ids:[28,12,14,878]},
        {id:274,title:"The Silence of the Lambs",overview:"Clarice Starling is a top student at the FBI's training academy. Jack Crawford wants Clarice to interview Dr. Hannibal Lecter, a brilliant psychiatrist who is also a violent psychopath.",poster_path:"/uS9m8OBk1RVfUPyyLBq6OGN3f6S.jpg",backdrop_path:"/mfwq2nMBzArzQ7Y9RKE8SKeeTkg.jpg",vote_average:8.3,vote_count:16000,popularity:65,release_date:"1991-02-01",genre_ids:[80,18,53,27]},
        {id:807,title:"Se7en",overview:"Two homicide detectives are on a desperate hunt for a serial killer whose crimes are based on the seven deadly sins.",poster_path:"/6yoghtyTpznpBik8EngEmJskVUO.jpg",backdrop_path:"/69EFgWWPFWbq3GCQg04C3F8BLnE.jpg",vote_average:8.3,vote_count:14000,popularity:60,release_date:"1995-09-22",genre_ids:[80,9648,53]},
        {id:299536,title:"Avengers: Infinity War",overview:"The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos.",poster_path:"/7WsyChQLEftFiDhRkZoL2yYsmn2.jpg",backdrop_path:"/lmZFxXgJE3vgrciwuDib0N8CfQo.jpg",vote_average:8.3,vote_count:28000,popularity:95,release_date:"2018-04-25",genre_ids:[12,28,878]},
        {id:24428,title:"The Avengers",overview:"When an unexpected enemy emerges and threatens global safety and security, Nick Fury, director of the international peacekeeping agency known as S.H.I.E.L.D., finds himself in need of a team to pull the world back from the brink of disaster.",poster_path:"/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",backdrop_path:"/kwUQFeFXOOpgloMgZaadhzkbCMh.jpg",vote_average:7.7,vote_count:30000,popularity:88,release_date:"2012-04-25",genre_ids:[878,28,12]},
        {id:671,title:"Harry Potter and the Philosopher's Stone",overview:"Harry Potter has lived under the stairs at his aunt and uncle's house his whole life. But on his 11th birthday, he learns he's a powerful wizard.",poster_path:"/wuMc08IPKEatf9rnMNXvIDIqA6t.jpg",backdrop_path:"/hziiv14OpD73u9gAak4XDDfBKa2.jpg",vote_average:7.9,vote_count:26000,popularity:85,release_date:"2001-11-16",genre_ids:[12,14]},
        {id:999901,title:"Mission: Impossible – The Final Reckoning",overview:"In the most dangerous mission yet, Ethan Hunt must track down a terrifying new weapon that threatens all of humanity before it falls into the wrong hands.",poster_path:"/z0RldAb2hMJn6JY0jqFMPglBnpn.jpg",backdrop_path:"/628Dep6AxEtDxjZoGP78TsOxYbK.jpg",vote_average:0,vote_count:0,popularity:145,release_date:"2025-05-21",genre_ids:[28,12,53]},
        {id:762509,title:"Mufasa: The Lion King",overview:"Mufasa, a cub lost and alone, meets a sympathetic lion named Taka, the heir to a royal bloodline.",poster_path:"/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",backdrop_path:"/q1UWoyL2gmxMfEuOxoKDD5hFSQW.jpg",vote_average:7.3,vote_count:2500,popularity:100,release_date:"2024-12-18",genre_ids:[16,12,18,10751]},
        {id:1011985,title:"Kung Fu Panda 4",overview:"Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior.",poster_path:"/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",backdrop_path:"/kYgQzzjNis5jJalYtIHgrom0gOx.jpg",vote_average:7.1,vote_count:3000,popularity:95,release_date:"2024-03-02",genre_ids:[16,28,35,10751]},
        {id:823464,title:"Godzilla Minus One",overview:"In postwar Japan, a traumatized former fighter pilot joins the civilian effort to fight off a massive nuclear-enhanced monster attacking their shores.",poster_path:"/hkxxMIGaiCTmrEArK7J56JTKUlB.jpg",backdrop_path:"/fY3lD0jM5AoHJMunjGWqJ0hRteI.jpg",vote_average:7.9,vote_count:4000,popularity:80,release_date:"2023-11-03",genre_ids:[878,28,18]},
        {id:299534,title:"Avengers: Endgame",overview:"After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.",poster_path:"/or06FN3Dka5tukK1e9SlTR1ib7H.jpg",backdrop_path:"/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",vote_average:8.3,vote_count:24000,popularity:92,release_date:"2019-04-24",genre_ids:[12,878,28]},
    ];

    const GENRE_MAP_LOCAL = {
        28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',
        99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',
        27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Science Fiction',
        10770:'TV Movie',53:'Thriller',10752:'War',37:'Western'
    };

    function getAll() { return movies; }

    function getById(id) { return movies.find(m => m.id === parseInt(id)); }

    function getTrending() { return [...movies].sort((a,b) => b.popularity - a.popularity).slice(0, 20); }

    function getTopRated() { return [...movies].sort((a,b) => b.vote_average - a.vote_average).slice(0, 20); }

    function getNowPlaying() { return [...movies].filter(m => parseInt((m.release_date||'').substring(0,4)) >= 2023).sort((a,b) => b.popularity - a.popularity).slice(0, 20); }

    function getUpcoming() { return [...movies].filter(m => parseInt((m.release_date||'').substring(0,4)) >= 2024).sort((a,b) => b.popularity - a.popularity).slice(0, 20); }

    function getPopular() { return getTrending(); }

    function search(query) {
        const q = query.toLowerCase();
        return movies.filter(m => m.title.toLowerCase().includes(q)).slice(0, 20);
    }

    function getByGenre(genreId) {
        return movies.filter(m => (m.genre_ids||[]).includes(parseInt(genreId))).sort((a,b) => b.popularity - a.popularity).slice(0, 20);
    }

    function getSimilar(id) {
        const movie = getById(id);
        if (!movie) return [];
        const genres = new Set(movie.genre_ids || []);
        return movies.filter(m => m.id !== movie.id && (m.genre_ids||[]).some(g => genres.has(g)))
            .sort((a,b) => b.vote_average - a.vote_average).slice(0, 20);
    }

    function discover(filters = {}) {
        let result = [...movies];
        if (filters.genres) {
            const gids = filters.genres.split(',').map(Number);
            result = result.filter(m => (m.genre_ids||[]).some(g => gids.includes(g)));
        }
        if (filters.minRating) result = result.filter(m => m.vote_average >= parseFloat(filters.minRating));
        if (filters.yearFrom) result = result.filter(m => parseInt((m.release_date||'').substring(0,4)) >= parseInt(filters.yearFrom));
        if (filters.yearTo) result = result.filter(m => parseInt((m.release_date||'').substring(0,4)) <= parseInt(filters.yearTo));
        const sortBy = filters.sortBy || 'popularity.desc';
        if (sortBy === 'popularity.desc') result.sort((a,b) => b.popularity - a.popularity);
        else if (sortBy === 'vote_average.desc') result.sort((a,b) => b.vote_average - a.vote_average);
        else if (sortBy === 'primary_release_date.desc') result.sort((a,b) => (b.release_date||'').localeCompare(a.release_date||''));
        else if (sortBy === 'primary_release_date.asc') result.sort((a,b) => (a.release_date||'').localeCompare(b.release_date||''));
        return result;
    }

    // Generate mock credits
    function getMovieDetails(id) {
        const movie = getById(id);
        if (!movie) return null;
        const castNames = ["Leonardo DiCaprio","Morgan Freeman","Scarlett Johansson","Tom Hanks","Brad Pitt","Natalie Portman","Keanu Reeves","Cate Blanchett","Christian Bale","Robert Downey Jr.","Emma Stone","Timothée Chalamet"];
        const characters = ["Lead","Supporting","Villain","Mentor","Hero","Detective","Scientist","Commander","Agent","Doctor","Warrior","Narrator"];
        return {
            ...movie,
            tagline: "A cinematic masterpiece.",
            runtime: 120 + Math.floor(Math.random()*60),
            spoken_languages: [{english_name:"English"}],
            genres: (movie.genre_ids||[]).map(gid => ({id: gid, name: GENRE_MAP_LOCAL[gid]||'Unknown'})),
            credits: { cast: castNames.slice(0,8).map((name,i) => ({id:i+1,name,character:characters[i]||'',profile_path:null})) },
            videos: { results: [{key:'dQw4w9WgXcQ',type:'Trailer',site:'YouTube',name:'Official Trailer'}] },
            similar: { results: getSimilar(id).slice(0,10) },
            recommendations: { results: getSimilar(id).slice(5,15) },
            keywords: { keywords: [] }
        };
    }

    return { getAll, getById, getTrending, getTopRated, getNowPlaying, getUpcoming, getPopular, search, getByGenre, getSimilar, discover, getMovieDetails };
})();
