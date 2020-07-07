# 2.0.3 - 2020-07-07
## Fix more circular dependencies cases

# 2.0.2 - 2019-07-21
## Add recursion cases

# 2.0.1 - 2019-05-12
## Add engines
This modules is supported for node engines >=10.12

# 2.0.0 - 2019-04-30
## Nodejs 12 support
Due to internal changes in require.resolve (paths option), moving internally to create a require instance (`createRequireFromPath`)

**API Change**: Accepts only one path argument (instead of multiple paths). It is now recommended to use this file as origin path `__filename` (although `__dirname` is also supported)
