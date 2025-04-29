import logging
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

class ClothingRecommendationService:
    """
    Сервис для генерации рекомендаций по одежде на основе погодных условий
    """

    # Температурные диапазоны и соответствующие рекомендации
    TEMP_RANGES = {
        "freezing": (-100, -10),  # Экстремально холодно
        "very_cold": (-10, 0),    # Очень холодно
        "cold": (0, 10),          # Холодно
        "cool": (10, 15),         # Прохладно
        "mild": (15, 20),         # Умеренно
        "warm": (20, 25),         # Тепло
        "hot": (25, 30),          # Жарко
        "very_hot": (30, 100)     # Очень жарко
    }

    # Типы активности
    ACTIVITY_TYPES = ["walk", "sport", "work", "leisure"]

    # База данных одежды по температурным диапазонам и типам активности
    CLOTHING_DB = {
        "freezing": {
            "walk": {
                "essential": ["теплый пуховик", "шапка-ушанка", "теплый шарф", "термобелье", "толстые варежки", "утепленные ботинки"],
                "recommended": ["термоноски", "утепленные штаны", "многослойная одежда", "защита для лица"],
                "accessories": ["грелки для рук", "термос с горячим напитком"]
            },
            "sport": {
                "essential": ["специальная термоодежда", "термобелье", "утепленные спортивные штаны", "теплая шапка", "теплые перчатки"],
                "recommended": ["шарф или бафф", "спортивная ветрозащитная куртка", "термоноски"],
                "accessories": ["теплый напиток в термосе"]
            },
            "work": {
                "essential": ["теплый пуховик", "шапка", "шарф", "перчатки", "теплая обувь", "термобелье"],
                "recommended": ["теплые брюки", "вязаный свитер", "утепленный жилет"],
                "accessories": ["термос с горячим напитком", "запасные теплые носки"]
            },
            "leisure": {
                "essential": ["теплая верхняя одежда", "шапка", "шарф", "перчатки", "теплая обувь"],
                "recommended": ["теплый свитер", "теплые носки", "термобелье"],
                "accessories": ["плед"]
            }
        },
        "very_cold": {
            "walk": {
                "essential": ["зимнее пальто/пуховик", "шапка", "шарф", "теплые перчатки", "зимние ботинки"],
                "recommended": ["термобелье", "теплые носки", "свитер"],
                "accessories": ["теплый напиток"]
            },
            "sport": {
                "essential": ["термобелье", "утепленные спортивные штаны", "спортивная куртка", "шапка", "перчатки"],
                "recommended": ["ветрозащитная куртка", "теплые носки", "бафф"],
                "accessories": ["спортивный термос"]
            },
            "work": {
                "essential": ["теплое пальто/пуховик", "шапка", "перчатки", "зимняя обувь"],
                "recommended": ["свитер", "теплые носки", "шарф"],
                "accessories": ["термос с чаем"]
            },
            "leisure": {
                "essential": ["теплая верхняя одежда", "шапка", "перчатки"],
                "recommended": ["свитер", "теплые носки", "шарф"],
                "accessories": ["плед", "теплый напиток"]
            }
        },
        "cold": {
            "walk": {
                "essential": ["куртка/пальто", "шапка", "перчатки", "ботинки"],
                "recommended": ["шарф", "свитер", "джинсы или брюки"],
                "accessories": ["зонт (при осадках)"]
            },
            "sport": {
                "essential": ["спортивная куртка", "спортивные штаны", "шапка"],
                "recommended": ["термобелье", "перчатки", "спортивные носки"],
                "accessories": ["спортивная бутылка с водой"]
            },
            "work": {
                "essential": ["пальто/куртка", "головной убор", "закрытая обувь"],
                "recommended": ["свитер/кардиган", "брюки/джинсы"],
                "accessories": ["зонт (при осадках)"]
            },
            "leisure": {
                "essential": ["куртка/кардиган", "джинсы/брюки"],
                "recommended": ["свитер", "шарф"],
                "accessories": ["теплый напиток"]
            }
        },
        "cool": {
            "walk": {
                "essential": ["легкая куртка/ветровка", "джинсы/брюки"],
                "recommended": ["свитер/кофта", "шарф", "кепка/шапка"],
                "accessories": ["зонт (при осадках)"]
            },
            "sport": {
                "essential": ["спортивные штаны", "футболка", "ветровка"],
                "recommended": ["спортивная шапка/кепка", "легкие перчатки"],
                "accessories": ["бутылка с водой"]
            },
            "work": {
                "essential": ["легкое пальто/жакет", "брюки/юбка"],
                "recommended": ["рубашка/блузка", "свитер/кардиган"],
                "accessories": ["шарф"]
            },
            "leisure": {
                "essential": ["джинсы/брюки", "рубашка/футболка"],
                "recommended": ["свитер/кофта", "кардиган"],
                "accessories": ["шарф"]
            }
        },
        "mild": {
            "walk": {
                "essential": ["футболка/рубашка", "джинсы/брюки/юбка"],
                "recommended": ["кофта/свитер", "ветровка"],
                "accessories": ["кепка/панама", "солнцезащитные очки"]
            },
            "sport": {
                "essential": ["футболка", "спортивные шорты/штаны"],
                "recommended": ["спортивная кофта", "кепка"],
                "accessories": ["бутылка с водой", "солнцезащитные очки"]
            },
            "work": {
                "essential": ["рубашка/блузка", "брюки/юбка"],
                "recommended": ["легкий кардиган/жакет"],
                "accessories": ["солнцезащитные очки"]
            },
            "leisure": {
                "essential": ["футболка/рубашка", "джинсы/брюки/юбка"],
                "recommended": ["кофта/свитер"],
                "accessories": ["солнцезащитные очки"]
            }
        },
        "warm": {
            "walk": {
                "essential": ["футболка/майка", "шорты/легкие брюки/юбка"],
                "recommended": ["рубашка/блузка с коротким рукавом", "легкая обувь"],
                "accessories": ["кепка/панама", "солнцезащитные очки", "солнцезащитный крем"]
            },
            "sport": {
                "essential": ["спортивная футболка/майка", "спортивные шорты"],
                "recommended": ["кепка", "солнцезащитные очки"],
                "accessories": ["бутылка с водой", "солнцезащитный крем", "полотенце"]
            },
            "work": {
                "essential": ["легкая рубашка/блузка", "легкие брюки/юбка"],
                "recommended": ["легкий жакет"],
                "accessories": ["солнцезащитные очки", "веер/вентилятор"]
            },
            "leisure": {
                "essential": ["футболка/майка", "шорты/легкие брюки/юбка"],
                "recommended": ["легкая рубашка/блузка"],
                "accessories": ["солнцезащитные очки", "солнцезащитный крем", "головной убор"]
            }
        },
        "hot": {
            "walk": {
                "essential": ["майка/футболка из натуральных тканей", "шорты/легкая юбка"],
                "recommended": ["сандалии/легкая обувь", "головной убор"],
                "accessories": ["солнцезащитные очки", "солнцезащитный крем", "бутылка воды"]
            },
            "sport": {
                "essential": ["легкая спортивная майка/футболка", "короткие спортивные шорты"],
                "recommended": ["головной убор", "солнцезащитные очки"],
                "accessories": ["полотенце", "бутылка воды", "солнцезащитный крем"]
            },
            "work": {
                "essential": ["легкая блузка/рубашка из натуральных тканей", "легкие брюки/юбка"],
                "recommended": ["легкая обувь"],
                "accessories": ["веер/вентилятор", "бутылка воды", "солнцезащитные очки"]
            },
            "leisure": {
                "essential": ["майка/футболка из натуральных тканей", "шорты/легкая юбка"],
                "recommended": ["сандалии/легкая обувь", "головной убор"],
                "accessories": ["солнцезащитные очки", "солнцезащитный крем", "бутылка воды"]
            }
        },
        "very_hot": {
            "walk": {
                "essential": ["максимально легкая одежда из натуральных тканей", "головной убор"],
                "recommended": ["сандалии/шлепанцы", "солнцезащитные очки"],
                "accessories": ["солнцезащитный крем", "бутылка воды", "зонт от солнца"]
            },
            "sport": {
                "essential": ["минимум одежды из дышащих тканей", "головной убор"],
                "recommended": ["солнцезащитные очки", "легкая обувь"],
                "accessories": ["полотенце", "много воды", "солнцезащитный крем", "спортивная бандана"]
            },
            "work": {
                "essential": ["максимально легкая одежда из натуральных тканей"],
                "recommended": ["легкая обувь", "минимум аксессуаров"],
                "accessories": ["веер/вентилятор", "бутылка воды", "солнцезащитные очки", "солнцезащитный крем"]
            },
            "leisure": {
                "essential": ["максимально легкая одежда из натуральных тканей", "головной убор"],
                "recommended": ["сандалии/шлепанцы", "солнцезащитные очки"],
                "accessories": ["солнцезащитный крем", "бутылка воды", "зонт от солнца"]
            }
        }
    }

    # Модификаторы для различных погодных условий
    WEATHER_MODIFIERS = {
        "rain": {
            "add": ["зонт", "водонепроницаемая куртка/плащ", "водонепроницаемая обувь"],
            "avoid": ["замшевая обувь", "одежда, которая долго сохнет"]
        },
        "strong_wind": {
            "add": ["ветрозащитная куртка", "плотная одежда", "шарф"],
            "avoid": ["свободная одежда", "широкополые шляпы"]
        },
        "snow": {
            "add": ["водонепроницаемая обувь", "теплая куртка", "перчатки", "шапка"],
            "avoid": ["тонкая обувь", "одежда без защиты от влаги"]
        },
        "fog": {
            "add": ["яркая одежда/аксессуары для видимости", "теплый шарф"],
            "avoid": []
        },
        "high_humidity": {
            "add": ["легкая одежда из натуральных тканей"],
            "avoid": ["синтетические ткани", "многослойная одежда"]
        },
        "high_uv": {
            "add": ["головной убор", "солнцезащитные очки", "солнцезащитный крем", "одежда с УФ-защитой"],
            "avoid": ["открытая одежда без защиты"]
        }
    }

    def __init__(self):
        pass

    def _get_temp_range(self, temperature: float) -> str:
        """
        Определить температурный диапазон по значению температуры

        Args:
            temperature (float): Температура в градусах Цельсия

        Returns:
            str: Ключ температурного диапазона
        """
        for range_key, (min_temp, max_temp) in self.TEMP_RANGES.items():
            if min_temp <= temperature < max_temp:
                return range_key

        # Если температура выходит за пределы заданных диапазонов
        if temperature < self.TEMP_RANGES["freezing"][0]:
            return "freezing"
        return "very_hot"

    def _get_weather_condition_modifiers(self, weather_data: Dict[str, Any]) -> List[str]:
        """
        Определить погодные условия, которые требуют дополнительных модификаторов

        Args:
            weather_data (Dict[str, Any]): Данные о погоде

        Returns:
            List[str]: Список ключей погодных условий
        """
        modifiers = []

        # Примеры определения погодных условий (зависит от формата данных API)
        precipitation = weather_data.get("precipitation", {})
        if precipitation and precipitation.get("type") == "rain" and precipitation.get("intensity") > 0:
            modifiers.append("rain")

        wind = weather_data.get("wind", {})
        if wind and wind.get("speed", 0) > 8:  # Сильный ветер > 8 м/с
            modifiers.append("strong_wind")

        if precipitation and precipitation.get("type") == "snow" and precipitation.get("intensity") > 0:
            modifiers.append("snow")

        if weather_data.get("phenomena", {}).get("fog", False):
            modifiers.append("fog")

        if weather_data.get("humidity", 0) > 80:  # Высокая влажность > 80%
            modifiers.append("high_humidity")

        if weather_data.get("uv_index", 0) > 5:  # Высокий УФ-индекс > 5
            modifiers.append("high_uv")

        return modifiers

    def get_recommendations(self, weather_data: Dict[str, Any], activity_type: str) -> Dict[str, Any]:
        """
        Получить рекомендации по одежде на основе погодных данных и типа активности

        Args:
            weather_data (Dict[str, Any]): Данные о погоде
            activity_type (str): Тип активности (walk, sport, work, leisure)

        Returns:
            Dict[str, Any]: Рекомендации по одежде
        """
        # Проверка корректности типа активности
        if activity_type not in self.ACTIVITY_TYPES:
            activity_type = "walk"  # По умолчанию прогулка

        # Определение температуры
        temperature = weather_data.get("temperature", {}).get("air", {}).get("C", 20)
        feels_like = weather_data.get("temperature", {}).get("comfort", {}).get("C", temperature)

        # Используем температуру "ощущается как" для расчета
        effective_temp = feels_like  # Можно использовать среднее между реальной и ощущаемой температурой

        # Определение температурного диапазона
        temp_range = self._get_temp_range(effective_temp)

        # Базовые рекомендации по одежде для данного температурного диапазона и активности
        recommendations = self.CLOTHING_DB.get(temp_range, {}).get(activity_type, {})
        if not recommendations:
            # Если нет рекомендаций для конкретного сочетания, используем рекомендации для прогулки
            recommendations = self.CLOTHING_DB.get(temp_range, {}).get("walk", {})

        # Копируем базовые рекомендации
        result = {
            "essential": recommendations.get("essential", [])[:],
            "recommended": recommendations.get("recommended", [])[:],
            "accessories": recommendations.get("accessories", [])[:],
            "avoid": []
        }

        # Применяем модификаторы на основе дополнительных погодных условий
        weather_conditions = self._get_weather_condition_modifiers(weather_data)

        for condition in weather_conditions:
            condition_modifiers = self.WEATHER_MODIFIERS.get(condition, {})
            for item in condition_modifiers.get("add", []):
                # Добавляем только если такого элемента еще нет в рекомендациях
                if item not in result["essential"] and item not in result["recommended"] and item not in result["accessories"]:
                    result["accessories"].append(item)

            # Добавляем элементы, которых следует избегать
            for item in condition_modifiers.get("avoid", []):
                if item not in result["avoid"]:
                    result["avoid"].append(item)

        # Добавляем дополнительную информацию
        result["temperature"] = {
            "actual": temperature,
            "feels_like": feels_like,
            "range": temp_range.replace("_", " ").capitalize()
        }
        result["weather_conditions"] = weather_conditions

        return result
