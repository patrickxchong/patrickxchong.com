---
title: Convert Vue To Android with Ionic Capacitor And CircleCI
excerpt: A great way to turn your web app into an android app for fun
status: published
tags:
  - Tech
  - WebDev
  - Tutorial
author: patrick-chong
date: 2020-06-20T02:31:10.530Z
image: /assets/images/uploads/npx-cap-init.png
imageCardPostPosition: left-top
---

**Note**: I would recommend anyone using Vue.js and wants to turn their webapp into a mobile app to checkout [Quasar](https://quasar.dev). They do it very well out of the box!

## What is Ionic Capacitor?

> Capacitor is a cross-platform app runtime that makes it easy to build web apps that run natively on iOS, Android, and the web. - From [Capacitor Docs](https://capacitor.ionicframework.com/docs/)

Capacitor is created by the Ionic framework (which is why I refer to it as Ionic Capacitor) In this case, I will use Capacitor compile a Vue.js app into a native Android debug apk that can be installed into Android phones.

## What is CircleCI?

> CircleCI automates your software builds, tests, and deployments. - From [CircleCI Docs](https://circleci.com/docs/2.0/about-circleci/#section=getting-started)

CircleCI integrates really well with Github and allows users to build executables, run tests and release software.

## Demo Source

For the purposes of this demonstration, I made a fork from an existing Hackernews clone built by Vue at https://github.com/vuejs/vue-hackernews-2.0 and made some modifications to it so that it uses vue-cli-service instead of SSR.

I then built the project with `yarn build` (which calls `vue-cli-service build`) which compiles the project as an spa into the `/dist` folder.

## Adding Capacitor

To add Capacitor to the Vue.js project, run `yarn add @capacitor/core @capacitor/cli`

Then `npx cap init` to initalize the Capacitor project.

![Output of npx cap init](/assets/images/uploads/npx-cap-init.png)

The command will create a `capacitor.config.json` in the root of the project. Here is the defaults in `capacitor.config.json` after running `npx cap init`.

```javascript
// capacitor.config.json
{
  "appId": "com.hackernews.vue",
  "appName": "vue-hackernews-2.0",
  "bundledWebRuntime": false,
  "npmClient": "yarn",
  "webDir": "www",
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 0
    }
  },
  "cordova": {}
}
```

**IMPORTANT!!!** The webDir in our case using Vue is `/dist` so we'll have to change it from `www` to `dist`.

To enable android in our project, run `npx cap add android`.

This creates an `/android` folder and adds `@capacitor/android` as a dependency in `package.json`.

For now I don't see a good reason to keep the android folder in version control since the contents will change whenever the project is updated so I added `android` into `.gitignore`.

I then run `npx cap sync` to update android dependencies, and copy web assets into the Android project.

And just like that, the webapp is Android ready!

One can run `npx cap open android` to open the project in Android Studio if Android Studio is installed.

## Adding CircleCI

Since I don't have Android Studio installed on my laptop (and I wasn't interested to do so since Android Studio is pretty large), I decided to try using CircleCI to build the project. There are 3 main parts to the script I made:

- build_yarn: install dependencies and run `npx cap add android` and `npx cap sync`
- build_android: build debug apk with `gradlew`
- publish-github-release: publish debug apk as a release on Github

Note 1: I created a config file at `/config/Android/AndroidManifest.xml` which will be copied into the `/android` folder during the build time on CircleCI so that I can reduce the number of permissions that the app requests. (Have to remember to change the package name in `AndroidManifest.xml` else the app will not open)

Note 2: I set up the use of `ghr` in `publish-github-release` based on the tutorial here: https://circleci.com/blog/publishing-to-github-releases-via-circleci/

The completed script is as follows

{% raw %}
```yaml
# .circleci/config.yml
version: 2
workflows:
  version: 2
  build-test-and-deploy:
    jobs:
      - build_yarn
      - build_android:
          requires:
            - build_yarn
      - publish-github-release:
          requires:
            - build_android

jobs:
  build_yarn:
    docker:
      - image: circleci/node:10-browsers
    steps:
      - checkout
      - restore_cache:
          name: Restore Node Modules Cache
          keys:
            - yarn-modules-{{ checksum "yarn.lock" }}
      - run: ls node_modules || yarn install --frozen-lockfile
      - save_cache:
          name: Save Node Modules Cache
          key: yarn-modules-{{ checksum "yarn.lock" }}
          paths:
            - node_modules
      - run: yarn build
      - run: npx cap add android
      - run: npx cap sync
      - persist_to_workspace:
          root: android
          paths:
            - ./*
  build_android:
    docker:
      - image: circleci/android:api-29-node
    environment:
      JVM_OPTS: -Xmx3200m
    steps:
      - checkout
      - attach_workspace:
          # Must be absolute path or relative path from working_directory
          at: android
      - restore_cache:
          name: Restore Node Modules Cache
          keys:
            - yarn-modules-{{ checksum "yarn.lock" }}
      - restore_cache:
          key: jars-{{ checksum "android/build.gradle" }}-{{ checksum  "android/build.gradle" }}
      - run:
          name: Chmod permissions #if permission for Gradlew Dependencies fail, use this.
          command: sudo chmod +x ./android/gradlew
      - run:
          name: Download Dependencies
          command: cd android && ./gradlew androidDependencies --debug
      - save_cache:
          paths:
            - ~/.gradle
          key: jars-{{ checksum "android/build.gradle" }}-{{ checksum  "android/build.gradle" }}
      - run:
          name: Copy configuration files
          command: cp config/Android/AndroidManifest.xml android/app/src/main/AndroidManifest.xml
      - run: # https://developer.android.com/studio/build/building-cmdline This creates an APK named module_name-debug.apk in project_name/module_name/build/outputs/apk/
          name: Build debug APK and release APK
          command: |
            cd android
            ./gradlew :app:assembleDebug
            ./gradlew :app:assembleRelease
            ./gradlew :app:assembleDebugAndroidTest
      - run:
          name: Run Tests
          command: cd android && ./gradlew lint test
      - store_artifacts: # for display in Artifacts: https://circleci.com/docs/2.0/artifacts/
          path: android/app/build/reports
          destination: reports
      - store_artifacts: # for display in Artifacts: https://circleci.com/docs/2.0/artifacts/
          path: android/app/build/outputs/apk
      # - store_artifacts: # for display in Artifacts: https://circleci.com/docs/2.0/artifacts/
      #     path: android/app/src/main/assets/public
      - store_test_results: # for display in Test Summary: https://circleci.com/docs/2.0/collect-test-data/
          path: android/app/build/test-results
      - persist_to_workspace:
          root: android/app/build/outputs
          paths:
            - ./apk/*

  publish-github-release:
    docker:
      - image: cibuilds/github:0.10
    steps:
      - attach_workspace:
          at: ./android
      - run:
          name: 'Publish Release on GitHub'
          command: |
            mv android/apk/debug/app-debug.apk android/apk
            mv android/apk/release/app-release-unsigned.apk android/apk
            ghr -t ${GITHUB_TOKEN} -u ${CIRCLE_PROJECT_USERNAME} -r ${CIRCLE_PROJECT_REPONAME} -c ${CIRCLE_SHA1} -delete ${CIRCLE_BUILD_NUM} ./android/apk/
```
{% endraw %}

The debug apk which can be installed into any Android phone can be found here: https://github.com/patrickxchong/vue-hackernews-2.0/releases/tag/8

All in all I'm pretty pleased with how it turned out! It has quite a native look and feel to it. It was a good opportunity for me to work with CircleCI and learn the differences between caches, workspaces and artifacts on the platform as well.

**References:**

- https://capacitor.ionicframework.com/docs/getting-started
- https://capacitor.ionicframework.com/docs/android
