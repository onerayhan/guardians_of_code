package com.example.kotlin_profile_page

import android.R
import android.app.AlertDialog
import android.app.Dialog
import android.os.Bundle
import android.view.LayoutInflater
import android.widget.ArrayAdapter
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.FragmentManager
import com.example.kotlin_profile_page.databinding.FollowingListBinding

class FollowingsListFragment : DialogFragment() {
    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        val binding = FollowingListBinding.inflate(LayoutInflater.from(requireContext()))


        val followingData = arrayOf("Irfan Can", "Edin Dzeko", "Mauro Icardi", "Irfan Can", "Edin Dzeko", "Mauro Icardi", "Irfan Can", "Edin Dzeko", "Mauro Icardi","Irfan Can", "Edin Dzeko", "Mauro Icardi")
        val adapter = ArrayAdapter(requireContext(), R.layout.simple_list_item_1, followingData)

        binding.followingListView.adapter = adapter

        val builder = AlertDialog.Builder(requireContext())
        builder.setView(binding.root)
            .setTitle("Followings List")
            .setPositiveButton("Close") { _, _ ->
                dismiss()
            }

        return builder.create()
    }

    companion object {
        fun show(fragmentManager: FragmentManager) {
            val fragment = FollowingsListFragment()
            fragment.show(fragmentManager, "followingsListFragment")
        }
    }
}
