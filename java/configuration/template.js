'use strict'
function createJavaTestTemplate(emittedTest) {
  return `// Generated by Java template
${emittedTest.hooks.deps.join('\n')}

public class ${emittedTest.name} extends TestSetup {
  ${emittedTest.hooks.vars.join('\n  ')}
  @BeforeMethod
  public void before(){
    ${emittedTest.hooks.beforeEach.join('\n    ')}
  }
  
  @AfterMethod
  public void after(){
    ${emittedTest.hooks.afterEach.join('\n    ')}
  }
  
  @Test${emittedTest.disabled ? '(enabled=false)' : ''}
  public void ${emittedTest.name}() {
    ${emittedTest.commands.join('\n    ')}
  }
}`
}

module.exports = createJavaTestTemplate
