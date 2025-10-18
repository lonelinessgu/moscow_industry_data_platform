// data/FieldsData
export const mainFields = [
  ['inn', 'ИНН', 'str', false],
  ['name', 'Наименование организации', 'str', false],
  ['status', 'Статус', 'str', false],
  ['legal_address', 'Юридический адрес', 'str', false],
  ['main_industry', 'Основная отрасль', 'str', false],
  ['sub_industry', 'Подотрасль (Основная)', 'str', false],
  ['main_okved', 'Основной ОКВЭД', 'str', false],
  ['registration_date', 'Дата регистрации', 'date', false],
  ['director', 'Руководитель', 'str', false],
  ['head_company', 'Головная организация', 'str', false],
  ['head_company_inn', 'ИНН головной организации', 'str', false],
  ['director_contacts', 'Контактные данные руководства', 'str', false],
  ['email', 'Электронная почта', 'email', false],
  ['msp_status', 'Статус МСП', 'str', false],
  ['revenue', 'Выручка предприятия, тыс. руб.', 'int', true],
  ['net_profit', 'Чистая прибыль (убыток), тыс. руб.', 'int', true],
  ['staff_count_total', 'Среднесписочная численность персонала (всего по компании), чел', 'int', true],
  ['profit_tax', 'Налог на прибыль, тыс. руб.', 'int', true],
  ['ndfl', 'НДФЛ, тыс. руб.', 'int', true]
];

export const productionFields = [
  ['production_address', 'Адрес производства', 'str', false],
  ['production_okved', 'Производственный ОКВЭД', 'str', false],
  ['production_area_sqm', 'Площадь производственных помещений, кв.м.', 'float', false],
  ['standardized_product', 'Стандартизированная продукция', 'str', false],
  ['product_types', 'Название (виды производимой продукции)', 'str', false],
  ['okpd2_products', 'Перечень производимой продукции по кодам ОКПД 2', 'str', false],
  ['product_segments', 'Перечень производимой продукции по типам и сегментам', 'str', false],
  ['product_catalog', 'Каталог продукции', 'str', false],
  ['state_contract', 'Наличие госзаказа', 'str', false],
  ['capacity_utilization', 'Уровень загрузки производственных мощностей', 'str', false],
  ['export_supply', 'Наличие поставок продукции на экспорт', 'str', false],
  ['export_volume_prev_year', 'Объем экспорта (млн руб.) за предыдущий календарный год', 'int', false],
  ['export_countries', 'Перечень государств-импортеров', 'str', false],
  ['production_address_coords', 'Координаты адреса производства', 'str', false],
  ['property_tax', 'Налог на имущество, тыс. руб.', 'int', true]
];

export const landFields = [
  ['cadastral_number_land', 'Кадастровый номер ЗУ', 'str', false],
  ['area_land', 'Площадь ЗУ', 'float', false],
  ['permitted_use_land', 'Вид разрешенного использования ЗУ', 'str', false],
  ['ownership_type_land', 'Вид собственности ЗУ', 'str', false],
  ['land_owner', 'Собственник ЗУ', 'str', false],
  ['land_tax', 'Налог на землю, тыс. руб.', 'int', true]
];

export const dopFields = [
  ['full_name', 'Полное наименование организации', 'str', false],
  ['main_okved_activity', 'Вид деятельности по основному ОКВЭД', 'str', false],
  ['employee_contacts', 'Контакт сотрудника организации', 'str', false],
  ['cs_responsible_contacts', 'Контактные данные ответственного по ЧС', 'str', false],
  ['support_measures', 'Данные об оказанных мерах поддержки', 'str', false],
  ['special_status', 'Наличие особого статуса', 'str', false],
  ['building_type', 'Тип строения и цель использования', 'str', false],
  ['staff_count_moscow', 'Среднесписочная численность персонала, работающего в Москве, чел', 'int', true],
  ['payroll_moscow', 'Фонд оплаты труда сотрудников, работающих в Москве, тыс. руб.', 'int', true],
  ['avg_salary_moscow', 'Средняя з.п. сотрудников, работающих в Москве, тыс. руб.', 'float', true],
  ['taxes_paid_moscow', 'Налоги, уплаченные в бюджет Москвы (без акцизов), тыс. руб.', 'int', true],
  ['other_taxes', 'Прочие налоги', 'int', true],
  ['excise', 'Акцизы, тыс. руб.', 'int', true],
  ['investments_moscow', 'Инвестиции в Мск, тыс. руб.', 'int', true],
  ['export_volume', 'Объем экспорта, тыс. руб.', 'int', true]
];

export const oksFields = [
  ['cadastral_number_oks', 'Кадастровый номер ОКСа', 'str', false],
  ['area_oks', 'Площадь ОКСов', 'float', false],
  ['permitted_use_oks', 'Вид разрешенного использования ОКСов', 'str', false],
  ['ownership_type_oks', 'Вид собственности ОКСов', 'str', false],
  ['oks_owner', 'Собственник ОКСов', 'str', false],
  ['additional_site_address', 'Адрес дополнительной площадки', 'str', false],
  ['legal_address_coords', 'Координаты юридического адреса', 'str', false],
  ['additional_site_coords', 'Координаты адреса дополнительной площадки', 'str', false],
  ['latitude', 'Координаты (широта)', 'float', false],
  ['longitude', 'Координаты (долгота)', 'float', false],
  ['district', 'Округ', 'str', false]
];