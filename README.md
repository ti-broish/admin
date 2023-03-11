# Ти Броиш - Преброителен център

Този проект съдържа кода за потребителския интерфейс на преброителния център, чрез който доброволци ще сверяват качените протоколи, обработват сигнали и чрез който упълномощени лица ще могат да администрират платформата и базата данни.

## Технология

Този проект е изграден изцяло с Webpack и React, като комуникира с API чрез axios. Проектът е изцяло статичен, но тъй като данните са по-динамични, не генерира предварително HTML за всеки ресурс и не използва рехидретация. Всички рекуести, които не са към статични файлове, трябва да връщат /index.html.

## Инсталация

```shell
git clone git@github.com:Da-Bulgaria/ti-broish-admin.git
cd ti-broish-admin
npm install
```

## Използване за разработка

Следната команда ще пусне Webpack Dev Server, който ще симулира средата на реалния сървър.

```shell
npm run serve
```

След като веднъж е пуснат, не е необходимо да се пуска всеки път, когато се промени кода, защото поддържа **Hot Reloading**.

## Използване за продукция

Следната команда ще генерира всички необходими файлове в папка /dist.

```shell
npm run build
```

Тези файлове после могат да се качат, ръчно или чрез скрипт, на продукционния сървър.

Всички файлове от папката /static се копират директно в /dist.

_Единствената конфигурация, от която се нуждае продукционния сървър е да пренасочва 404 към /index.html._

## Стриктна типизация

Няколко компонента са преработени да хвърлят грешки ако нещо в типовете на данните не е наред, това се постига като се сложи `//@ts-check` като първи ред на файла. Типовите декларации са писани с JSDoc и за да захапят, файловете в `./src/types` трябва да бъдат заредени в едитора, иначе няма да успее да ги разпознае.
