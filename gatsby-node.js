const path = require('path');

exports.createPages = async ({ actions, graphql, reporter }) => {
    const { createPage } = actions
  
    const blogPostTemplate = require.resolve(`./src/templates/blogTemplate.js`)
  
    const result = await graphql(`
    {
        allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}, limit: 1000) {
            edges {
              node {
                id
                excerpt(pruneLength: 1000)
                html
                frontmatter {
                  path
                  title
                  date
                }
              }
            }
          }
      }
    `)
  
    // Handle errors
    if (result.errors) {
      reporter.panicOnBuild(`Error while running GraphQL query.`)
      return
    }
  
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: blogPostTemplate,
        context: {
          // additional data can be passed via context
          path: node.frontmatter.path
        },
      })
    })
  }