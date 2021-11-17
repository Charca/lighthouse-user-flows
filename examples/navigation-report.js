const fs = require('fs')
const open = require('open')
const puppeteer = require('puppeteer')
const lighthouse = require('lighthouse/lighthouse-core/fraggle-rock/api.js')

async function captureReport() {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  const testUrl = 'https://www.web.dev/'
  const flow = await lighthouse.startFlow(page, {
    name: 'Navigation User Flow',
  })

  // Cold Navigation
  await flow.navigate(testUrl, { stepName: 'Cold Page-Load' })

  // Warm Navigation
  await flow.navigate(testUrl, {
    stepName: 'Warm Page-Load',
    settingOverrides: {
      disableStorageReset: true,
    },
  })

  await browser.close()

  const reportPath = __dirname + '/navigation.report.html'
  const report = flow.generateReport()

  fs.writeFileSync(reportPath, report)
  open(reportPath, { wait: false })
}

captureReport()
