const PORT = process.env.PORT ||heroku --version 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const sites = [
    {
        name: 'Ofertas Sapo',
        address: 'https://emprego.sapo.pt/',
        base: ''

    },

    {
        name: 'Ofertas Net-Emprego',
        address: 'https://www.net-empregos.com/emprego-lisboa.asp',
        base: 'https://www.net-empregos.com/'

    }

]

const articles = []

sites.forEach(sites => {
    axios.get(sites.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Lisboa")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url: sites.base + url,
                    source: sites.name
                })
            })
        })

})

app.get('/jobsearch', (request, response) => {
    response.json('Bem vindo às ofertas de trabalho em destaque para Lisboa')
})


app.get('/jobsearch', (request, response) => {
    response.json(articles)

})

app.get('/searchjob/:newjobId',  (request, response) => {

    const jobId = request.params.newjobId
    const sitesadress = sites.filter(site => sites.name == newjobId)[0].address
    const sitebase = sites.filter(sites => sites.name == newjobId)[0].base

    axios.get(sitesaddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Lisboa")', html).each(function () {

                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: sitebase + url,
                    source: newjobId
                })
            })
            response.json(specificArticles)


        }).catch(err => console.log(err))


})

app.listen(PORT, () => console.log('server running on port $PORT'))