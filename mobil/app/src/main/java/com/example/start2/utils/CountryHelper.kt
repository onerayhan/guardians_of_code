package com.example.start2.utils

import android.content.Context
import android.util.Log
import com.example.start2.models.Country
import com.google.gson.Gson
import com.example.start2.R
import com.google.gson.JsonSyntaxException

class CountryHelper {

    private var cachedCountries: List<Country>? = null

    fun loadCountriesFromJson(context: Context): List<Country> {
        // Return cached countries if already loaded
        cachedCountries?.let { return it }

        return try {
            val inputStream = context.resources.openRawResource(R.raw.countries)
            val json = inputStream.bufferedReader().use { it.readText() }
            val gson = Gson()
            val countries = gson.fromJson(json, Array<Country>::class.java).toList()

            // Cache the loaded countries
            cachedCountries = countries
            countries

        } catch (e: JsonSyntaxException) {
            Log.e("CountryHelper", "Error parsing countries JSON", e)
            emptyList()
        } catch (e: Exception) {
            Log.e("CountryHelper", "Error loading countries", e)
            emptyList()
        }
    }
}
